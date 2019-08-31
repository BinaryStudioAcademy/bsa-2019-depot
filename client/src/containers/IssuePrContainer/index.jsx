import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Input, Dropdown, Button, Label } from 'semantic-ui-react';
import IssuesList from '../../components/IssuesList';

import styles from './styles.module.scss';

class IssuePrContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterByTitle: ''
    };
  }

  countOpenData = () => {
    const { data } = this.props;
    const counter = data.filter(dataItem => dataItem.isOpened);
    return counter.length;
  };

  countClosedData = () => {
    const { data } = this.props;
    const counter = data.filter(dataItem => !dataItem.isOpened);
    return counter.length;
  };

  renderFilteredData = () => {
    const { data } = this.props;
    const { filterByTitle } = this.state;
    return data.filter(({ title }) => title.includes(filterByTitle));
  };

  filterData = ({target}) => {
    this.setState({
      ...this.state,
      filterByTitle: target.value
    });
  };

  onCreateDataItem = () => {
    const { location, history } = this.props;
    history.push(`${location.pathname}/new`);
  };

  onShowLabels = () => {
    const { history, match } = this.props;
    const { username, reponame } = match.params;
    history.push(`/${username}/${reponame}/labels`);
  };

  render() {
    const { data, isIssues } = this.props;
    const { filterByTitle } = this.state;

    const authorList = data.reduce((acc, { user }) => {
      return !acc.includes(user.username) ? [...acc, user.username] : acc;
    }, []);

    const openData = this.countOpenData();
    const closedData = this.countClosedData();
    const filteredData = filterByTitle ? this.renderFilteredData() : data;

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
    const text = isIssues ? 'Issues' : 'Pull Requests';
    const filterOptions = [
      {
        key: 0,
        text: `Your ${text}`,
        value: `Your ${text}`
      }
    ];

    return (
      <>
        <div className={styles.filterRow}>
          <div className={styles.leftGroup}>
            <Input
              label={<Dropdown text="Filters" options={filterOptions} />}
              labelPosition="left"
              placeholder="Filter by title"
              onChange={this.filterData}
            />
            <Button basic className={styles.labelButton} onClick={this.onShowLabels}>
              <Button.Content className={styles.labelButtonIcon}>
                <Icon name="tag" />
              </Button.Content>

              <Button.Content className={styles.labelButtonText}>Labels</Button.Content>
              <Button.Content className={styles.labelButtonContent}>
                <Label circular>8</Label>
              </Button.Content>
            </Button>
          </div>
          <Button content={`New ${isIssues ? 'Issue' : 'Pull Request'}`} positive onClick={this.onCreateDataItem} />
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.dataHeader}>
            <div>
              <span className={styles.openedData}>
                <Icon name="info" /> {openData} Open
              </span>
              <span className={styles.closedData}>
                <Icon name="check" /> {closedData} Closed
              </span>
            </div>
            <div className={styles.dataFilters}>
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
                    {data
                      .map(dataItem => data.assignees)
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
          {isIssues ? <IssuesList issues={filteredData} /> : /*<PullRequestsList pullRequests={filteredData} />*/ null}
        </div>
      </>
    );
  }
}

IssuePrContainer.propTypes = {
  isIssues: PropTypes.bool,
  reponame: PropTypes.string,
  data: PropTypes.array.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.object,
  location: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func
};

export default withRouter(IssuePrContainer);
