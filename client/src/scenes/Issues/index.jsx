import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader, Icon, Input, Dropdown } from 'semantic-ui-react';
import IssuesList from '../../components/IssuesList';
import * as issuesService from '../../services/issuesService';

import styles from './styles.module.scss';

class Issues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: {},
      openIssues: 0,
      closedIssues: 0,
      filterByTitle: '',
      filter: {
        title: '',
        author: '',
        assignees: [],
        opened: true
      }
    };
  }

  async componentDidMount() {
    await this.fetchIssues();
  }

  async fetchIssues(isOpened = true) {
    const { userId } = this.props;
    try {
      await this.setLoading(true);
      const issuesData = await issuesService.getAllIssues(userId, isOpened);

      if (isOpened) {
        this.setState({
          ...this.state,
          issues: { ...this.state.issues, open: { issuesData } }
        });
      } else {
        this.setState({
          ...this.state,
          issues: { ...this.state.issues, closed: { issuesData } }
        });
      }
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
  renderFilteredIssues = () => {
    const { issues } = this.props;
    const { filterByTitle } = this.state;
    return issues.filter(({ title }) => title.includes(filterByTitle));
  };

  filterIssues = e => {
    this.setState({
      ...this.state,
      filterByTitle: e.target.value
    });
  };

  render() {
    const { loading, issues, filterByTitle, openIssues, closedIssues } = this.state;

    const authorList = issues.reduce((acc, { user }) => {
      return !acc.includes(user.username) ? [...acc, user.username] : acc;
    }, []);

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
      }
    ];

    const filterOptions = [
      {
        key: 0,
        text: 'Your Issues',
        value: 'Your Issues'
      }
    ];

    return loading ? (
      <Loader active />
    ) : (
      <>
        <div className={styles.filterRow}>
          <Input
            label={<Dropdown text="Filters" options={filterOptions} />}
            labelPosition="left"
            placeholder="Filter by title"
            onChange={this.filterIssues}
          />
        </div>
        <div className={styles.issuesContainer}>
          <div className={styles.issuesHeader}>
            <div className="issues-counters">
              <span className={styles.openedIssues}>
                <Icon name="info" /> {openIssues} Open
              </span>
              <span className={styles.closedIssues}>
                <Icon name="check" /> {closedIssues} Closed
              </span>
            </div>
            <div className={styles.issueFilters}>
              <Dropdown text="Author" icon="filter">
                <Dropdown.Menu>
                  <Input icon="search" iconPosition="left" className="search" placeholder="Filter authors" />
                  <Dropdown.Menu scrolling>
                    {authorList.map((author, index) => (
                      <Dropdown.Item key={index} text={author} value={author} />
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown text="Assignee" icon="filter">
                <Dropdown.Menu>
                  <Input icon="search" iconPosition="left" className="search" placeholder="Filter assignees" />
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
              <Dropdown text="Sort" icon="filter">
                <Dropdown.Menu>
                  {sortOptions.map(({ key, text, value }) => (
                    <Dropdown.Item key={key} text={text} value={value} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <IssuesList issues={filteredIssues} match={{}} />
        </div>
      </>
    );
  }
}

Issues.propTypes = {
  issues: PropTypes.array.isRequired,
  issuesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    issues: PropTypes.array
  }),
  userId: PropTypes.string.isRequired,
  fetchIssues: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({
  userId: id
});

export default connect(mapStateToProps)(Issues);
