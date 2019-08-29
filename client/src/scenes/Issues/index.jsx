import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as queryString from 'query-string';
import { Loader, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import IssuesList from '../../components/IssuesList';
import * as issuesService from '../../services/issuesService';

import styles from './styles.module.scss';

class Issues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: [],
      openIssuesCount: 0,
      closedIssuesCount: 0,
      filterByTitle: '',
      isOpened: true,
      filter: {
        title: '',
        opened: true
      },
      loading: false,
      error: '',
      sort: 'createdAt_DESC'
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username }
      }
    } = this.props;
    const isOpened = this.getIsOpenedFromQuery();
    const sort = this.getSortFromQuery();
    await this.fetchIssues(username, isOpened, sort);
  }

  getIsOpenedFromQuery = () => {
    if (!this.props.location.search) {
      return true;
    }
    const isOpenedString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).isOpened;

    return isOpenedString ? JSON.parse(isOpenedString) : true;
  };

  getSortFromQuery = () => {
    if (!this.props.location.search) {
      return 'createdAt_DESC';
    }
    const sortString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).sort;

    return sortString ? JSON.parse(sortString) : 'createdAt_DESC';
  };

  async fetchIssues(username, isOpened = true, sort = 'createdAt_DESC') {
    try {
      await this.setLoading(true);
      const issuesData = await issuesService.getAllIssues(username, isOpened, sort);
      const { issues, open, close } = issuesData;
      this.setState({
        ...this.state,
        issues,
        openIssuesCount: open,
        closedIssuesCount: close,
        isOpened,
        sort
      });
    } catch (err) {
      await this.setError(err);
    } finally {
      await this.setLoading(false);
    }
  }

  async setLoading(loading) {
    await this.setState({
      ...this.state,
      loading
    });
  }

  async setError(err) {
    await this.setState({
      ...this.state,
      error: err
    });
  }

  renderFilteredIssues = () => {
    const { filterByTitle, issues } = this.state;
    return issues.filter(({ title }) => title.includes(filterByTitle));
  };

  filterIssues = e => {
    this.setState({
      ...this.state,
      filterByTitle: e.target.value
    });
  };

  getOpened = () => {
    this.changeTab(true);
  };

  getClosed = () => {
    this.changeTab(false);
  };

  changeTab = open => {
    const {
      location,
      history,
      match: {
        params: { username }
      }
    } = this.props;
    this.fetchIssues(username, open);
    history.push(`${location.pathname}?isOpened=${open}`);
  };

  render() {
    const { match } = this.props;
    const { loading, issues, filterByTitle, openIssuesCount, closedIssuesCount } = this.state;

    // const authorList = issues.reduce((acc, {user}) => {
    //   return !acc.includes(user.username) ? [...acc, user.username] : acc;
    // }, []);

    const filteredIssues = filterByTitle ? this.renderFilteredIssues() : issues;

    // Mock data
    const sortOptions = [
      {
        key: 'createdAt_DESC',
        text: 'Newest',
        value: 'createdAt_DESC'
      },
      {
        key: 'createdAt_ASC',
        text: 'Oldest',
        value: 'createdAt_ASC'
      },
      {
        key: 'commentCount_DESC',
        text: 'Most commented',
        value: 'commentCount_DESC'
      },
      {
        key: 'commentCount_ASC',
        text: 'Least commented',
        value: 'commentCount_ASC'
      },
      {
        key: 'updatedAt_DESC',
        text: 'Recently update',
        value: 'updatedAt_DESC'
      },
      {
        key: 'updatedAt_ASC',
        text: 'Least recently update',
        value: 'updatedAt_ASC'
      }
    ];

    return loading ? (
      <Loader active />
    ) : (
      <div className={styles.container}>
        <div className={styles.filterRow}>
          <Button.Group>
            <Button active>Created</Button>
            <Button disabled>Assigned</Button>
            <Button disabled>Mentioned</Button>
          </Button.Group>
          <Input labelPosition="left" placeholder="Filter by title" onChange={this.filterIssues} />
        </div>
        <div className={styles.issuesContainer}>
          <div className={styles.issuesHeader}>
            <div className="issues-counters">
              <span className={`${styles.openedIssues}`} onClick={this.getOpened}>
                <Icon name="info" /> {openIssuesCount} Open
              </span>
              <span className={`${styles.closedIssues}`} onClick={this.getClosed}>
                <Icon name="check" /> {closedIssuesCount} Closed
              </span>
            </div>
            <div className={styles.issueFilters}>
              <Dropdown text="Orgainzation" icon="caret down">
                <Dropdown.Menu>
                  <Input
                    icon="search"
                    iconPosition="left"
                    className="search"
                    placeholder="Filter by organization or owner"
                  />
                  {/* <Dropdown.Menu scrolling>
                    {issues
                      .map(issue => issue.assignees)
                      .flat()
                      .map(assignee => (
                        <Dropdown.Item key={assignee.username} text={assignee.username} value={assignee.username} />
                      ))}
                  </Dropdown.Menu> */}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown text="Sort" icon="caret down">
                <Dropdown.Menu>
                  {sortOptions.map(({ key, text, value }) => (
                    <Dropdown.Item key={key} text={text} value={value} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <IssuesList issues={filteredIssues} match={match} />
        </div>
      </div>
    );
  }
}

Issues.propTypes = {
  error: PropTypes.string,
  issues: PropTypes.array,
  fetchIssues: PropTypes.func,
  loading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(Issues);
