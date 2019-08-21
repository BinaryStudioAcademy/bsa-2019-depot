import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import { fetchIssues } from '../../routines/routines';
import IssuesList from '../../components/IssuesList';

import styles from './styles.module.scss';

class IssuesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterByTitle: '',
      filter: {
        title: '',
        author: '',
        assignees: [],
        opened: true
      }
    };
  }

  componentDidMount() {
    const { username, repoName, repositoryId } = this.props;
    this.props.fetchIssues({
      username,
      repoName,
      repositoryId,
      filter: this.state.filter
    });
  }

  countOpenIssues = () => {
    const counter = this.props.issuesData.issues.filter(issue => issue.isOpened);
    return counter.length;
  };

  countClosedIssues = () => {
    const counter = this.props.issuesData.issues.filter(issue => !issue.isOpened);
    return counter.length;
  };

  renderFilteredIssues = () => {
    const {
      issuesData: { issues }
    } = this.props;
    const { filterByTitle } = this.state;
    return issues.filter(({ title }) => title.includes(filterByTitle));
  };

  filterIssues = e => {
    this.setState({
      ...this.state,
      filterByTitle: e.target.value
    });
  };

  onCreateIssue = () => {
    const { location, history } = this.props;
    history.push(`${location.pathname}/new`);
  };

  render() {
    const {
      issuesData: { loading, issues },
      match
    } = this.props;
    const { filterByTitle } = this.state;

    const authorList = issues.reduce((acc, { user }) => {
      return !acc.includes(user.username) ? [...acc, user.username] : acc;
    }, []);

    const openIssues = this.countOpenIssues();
    const closedIssues = this.countClosedIssues();
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
          <Button content="New Issue" positive onClick={this.onCreateIssue} />
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
          <IssuesList issues={filteredIssues} match={match} />
        </div>
      </>
    );
  }
}

IssuesTab.propTypes = {
  username: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
  repositoryId: PropTypes.number.isRequired,
  issuesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    issues: PropTypes.array
  }).isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  fetchIssues: PropTypes.func.isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired
};

const mapStateToProps = ({
  issuesData,
  currentRepo: {
    currentRepoInfo: { id, name }
  },
  profile: {
    currentUser: { username }
  }
}) => ({
  username,
  repoName: name,
  issuesData,
  repositoryId: id
});

const mapDispatchToProps = {
  fetchIssues
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesTab);
