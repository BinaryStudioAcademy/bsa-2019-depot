import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Input, Dropdown, Button, Label, Segment } from 'semantic-ui-react';
import { PullRequestOutline } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';
import DataList from '../../components/DataList';
import { getLabels } from '../../services/labelsService';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';

import styles from './styles.module.scss';
AntdIcon.add(PullRequestOutline);

class IssuePrContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterByTitle: '',
      showOpenData: true,
      labelsCount: null
    };
  }

  async componentDidMount() {
    const { username, reponame } = this.props.match.params;
    const { id } = await getRepositoryByOwnerAndName({ username, reponame });
    const labels = await getLabels(id);
    this.setState({
      labelsCount: labels.length
    });
  }

  openData = () => {
    const { data, isIssues } = this.props;
    const openData = isIssues
      ? data.filter(dataItem => dataItem.isOpened)
      : data.filter(dataItem => dataItem.prstatus.name === 'OPEN');
    return openData;
  };

  closedData = () => {
    const { data, isIssues } = this.props;
    const closedData = isIssues
      ? data.filter(dataItem => !dataItem.isOpened)
      : data.filter(dataItem => dataItem.prstatus.name !== 'OPEN');
    return closedData;
  };

  renderFilteredData = () => {
    const { showOpenData } = this.state;
    const data = showOpenData ? this.openData() : this.closedData();
    const { filterByTitle } = this.state;
    return data.filter(({ title }) => title.includes(filterByTitle));
  };

  filterData = ({ target }) => {
    this.setState({
      filterByTitle: target.value
    });
  };

  onCreateDataItem = () => {
    const { isIssues, location, match, history } = this.props;
    const { username, reponame } = match.params;

    if (isIssues) {
      history.push(`${location.pathname}/new`);
    } else {
      history.push(`/${username}/${reponame}/compare`);
    }
  };

  onShowLabels = () => {
    const { history, match } = this.props;
    const { username, reponame } = match.params;
    history.push(`/${username}/${reponame}/labels`);
  };

  showOpenData = () => {
    this.setState({
      showOpenData: true
    });
  };

  showClosedData = () => {
    this.setState({
      showOpenData: false
    });
  };

  render() {
    const { data, isIssues } = this.props;
    const { labelsCount } = this.state;

    const authorList = data.reduce((acc, { user }) => {
      return !acc.includes(user.username) ? [...acc, user.username] : acc;
    }, []);

    const openData = this.openData();
    const closedData = this.closedData();
    const filteredData = this.renderFilteredData();

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
      <Segment basic>
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
                <Label circular>{labelsCount}</Label>
              </Button.Content>
            </Button>
          </div>
          <Button content={`New ${isIssues ? 'Issue' : 'Pull Request'}`} positive onClick={this.onCreateDataItem} />
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.dataHeader}>
            <div>
              <span className={styles.openedData} onClick={this.showOpenData}>
                {isIssues ? (
                  <Icon name="info" />
                ) : (
                  <Icon>
                    <AntdIcon type={PullRequestOutline} />
                  </Icon>
                )}{' '}
                {openData.length} Open
              </span>
              <span className={styles.closedData} onClick={this.showClosedData}>
                <Icon name="check" /> {closedData.length} Closed
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
          <DataList data={filteredData} isPull={!isIssues} />
        </div>
      </Segment>
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
