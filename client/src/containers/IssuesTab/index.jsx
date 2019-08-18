import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Loader, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import { fetchIssues } from '../../routines/routines';
import IssuesList from '../../components/IssuesList';

import styles from './styles.module.scss';

class IssuesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        title: '',
        author: '',
        assignees: [],
        opened: true
      }
    };
  }

  componentDidMount() {
    this.props.fetchIssues({
      filter: this.state.filter
    });
  }

  render() {
    const {
      issuesData: { loading, issues },
      match
    } = this.props;

    // Mock data
    const openIssues = 20;
    const closedIssues = 34;

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
          />
          <Link to={`${match.url}/new`}>
            <Button content="New Issue" primary />
          </Link>
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
                    {issues
                      .map(issue => issue.author)
                      .map((author, index) => (
                        <Dropdown.Item key={index} text={author.username} value={author.username} />
                      ))}
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown text="Assignee" icon="filter">
                <Dropdown.Menu>
                  <Input icon="search" iconPosition="left" className="search" placeholder="Filter assignees" />
                  <Dropdown.Menu scrolling>
                    {issues
                      .map(issue => issue.assignees)
                      .flat()
                      .map(assignee => (
                        <Dropdown.Item key={assignee.username} text={assignee.username} value={assignee.username} />
                      ))}
                  </Dropdown.Menu>
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
          <IssuesList issues={issues} />
        </div>
      </>
    );
  }
}

IssuesTab.propTypes = {
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
  fetchIssues: PropTypes.func.isRequired
};

const mapStateToProps = ({ issuesData }) => ({
  issuesData
});

const mapDispatchToProps = {
  fetchIssues
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesTab);
