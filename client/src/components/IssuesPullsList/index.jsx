import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Icon, Input, Dropdown, Button, Label, Segment, Loader } from 'semantic-ui-react';
import { PullRequestOutline } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';
import DataList from '../DataList';
import * as RepoService from '../../services/repositoryService';
import { getLabels } from '../../services/labelsService';
import { getUserImgLink } from '../../helpers/imageHelper';
import debounce from 'debounce-promise';

import styles from './styles.module.scss';
AntdIcon.add(PullRequestOutline);

const sortOptions = [
  {
    key: 'created_desc',
    text: 'Newest',
    value: 'created_desc'
  },
  {
    key: 'created_asc',
    text: 'Oldest',
    value: 'created_asc'
  },
  {
    key: 'updated_desc',
    text: 'Recently updated',
    value: 'updated_desc'
  },
  {
    key: 'updated_asc',
    text: 'Last recently updated',
    value: 'updated_asc'
  },
  {
    key: 'comments_desc',
    text: 'Most commented',
    value: 'comments_desc'
  },
  {
    key: 'comments_asc',
    text: 'Least commented',
    value: 'comments_asc'
  }
];

class IssuesPullsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isIssues: true,
      filter: {
        title: '',
        isOpened: true,
        authorId: '',
        assigneeId: '',
        sort: 'created_desc'
      },
      labelsCount: 0,
      openCount: 0,
      closedCount: 0,
      authorList: [],
      assigneeList: [],
      loading: true,
      authorDropdownFilter: '',
      assigneeDropdownFilter: ''
    };
  }

  fetchData = async () => {
    const { repositoryId, isIssues } = this.props;
    const { filter } = this.state;
    const labelsCount = (await getLabels(repositoryId)).length;
    const queryFilter = { ...filter };
    Object.keys(queryFilter).forEach(key => queryFilter[key] === '' && delete queryFilter[key]);

    if (isIssues) {
      const {
        openCount,
        closedCount,
        authors: authorList,
        assignees: assigneeList,
        issues: items
      } = await RepoService.getRepositoryIssues(repositoryId, queryFilter);
      this.setState({ openCount, closedCount, authorList, assigneeList, items, labelsCount, loading: false });
    } else {
      const { openCount, closedCount, authors: authorList, pulls: items } = await RepoService.getRepositoryPulls(
        repositoryId,
        queryFilter
      );
      this.setState({ isIssues, openCount, closedCount, authorList, items, labelsCount, loading: false });
    }
  };

  debouncedFetchData = debounce(this.fetchData, 500);

  async componentDidMount() {
    await this.fetchData();
  }

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

  onOpen = async () => {
    await this.setState({ filter: { ...this.state.filter, isOpened: true } });
    this.fetchData();
  };

  onClosed = async () => {
    await this.setState({ filter: { ...this.state.filter, isOpened: false } });
    this.fetchData();
  };

  onAuthorChange = async (e, { value: newAuthorId }) => {
    const {
      filter: { authorId: oldAuthorId }
    } = this.state;

    const authorId = newAuthorId === oldAuthorId ? '' : newAuthorId;

    await this.setState({ filter: { ...this.state.filter, authorId } });
    this.fetchData();
  };

  onAssigneeChange = async (e, { value: newAssigneeId }) => {
    const {
      filter: { assigneeId: oldAssigneeId }
    } = this.state;

    const assigneeId = newAssigneeId === oldAssigneeId ? '' : newAssigneeId;

    await this.setState({ filter: { ...this.state.filter, assigneeId } });
    this.fetchData();
  };

  onTitleChange = (e, { value }) => {
    this.setState({ filter: { ...this.state.filter, title: value } });
    this.debouncedFetchData();
  };

  onTitleHitEnter = e => {
    if (e.key === 'Enter') {
      this.fetchData();
    }
  };

  onUserInputClick = e => {
    e.stopPropagation();
  };

  onUserInputChange = async (e, { value }) => {
    switch (e.target.name) {
    case 'author':
      await this.setState({ authorDropdownFilter: value });
      break;
    case 'assignee':
      await this.setState({ assigneeDropdownFilter: value });
      break;
    default:
      return;
    }
  };

  onUserInputHitEnter = async e => {
    if (e.key === 'Enter') {
      switch (e.target.name) {
      case 'author':
        const { authorList, authorDropdownFilter } = this.state;
        const filteredAuthorList = authorList.filter(author => author.username.includes(authorDropdownFilter));
        if (filteredAuthorList.length > 0) {
          await this.setState({
            authorDropdownFilter: '',
            filter: { ...this.state.filter, authorId: filteredAuthorList[0].id }
          });
          this.fetchData();
        }
        break;
      case 'assignee':
        const { assigneeList, assigneeDropdownFilter } = this.state;
        const filteredAssigneeList = assigneeList.filter(
          assignee => assignee && assignee.username && assignee.username.includes(assigneeDropdownFilter)
        );

        if (filteredAssigneeList.length > 0) {
          await this.setState({
            assigneeDropdownFilter: '',
            filter: { ...this.state.filter, assigneeId: filteredAssigneeList[0].id }
          });
          this.fetchData();
        }
        break;
      default:
        return;
      }
    }
  };

  onSortChange = async (e, { value }) => {
    await this.setState({ filter: { ...this.state.filter, sort: value } });
    this.fetchData();
  };

  render() {
    const {
      items,
      isIssues,
      filter: { title, isOpened, authorId, assigneeId, sort },
      openCount,
      closedCount,
      authorDropdownFilter,
      assigneeDropdownFilter,
      authorList,
      assigneeList,
      labelsCount,
      loading
    } = this.state;

    const filteredAuthorList = authorList.filter(author => author.username.includes(authorDropdownFilter));
    const filteredAssigneeList = assigneeList.filter(
      assignee => assignee && assignee.username && assignee.username.includes(assigneeDropdownFilter)
    );

    return !loading ? (
      <Segment basic>
        <div className={styles.filterRow}>
          <div className={styles.leftGroup}>
            <Input
              placeholder="Filter by title"
              value={title}
              onChange={this.onTitleChange}
              onBlur={this.fetchData}
              onKeyUp={this.onTitleHitEnter}
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
              <span className={`${styles.openedData} ${isOpened ? styles.active : null}`} onClick={this.onOpen}>
                {isIssues ? (
                  <Icon name="info" />
                ) : (
                  <Icon>
                    <AntdIcon type={PullRequestOutline} />
                  </Icon>
                )}{' '}
                {openCount} Open
              </span>
              <span className={`${styles.closedData} ${!isOpened ? styles.active : null}`} onClick={this.onClosed}>
                <Icon name="check" /> {closedCount} Closed
              </span>
            </div>
            <div className={styles.dataFilters}>
              <Dropdown
                text="Author"
                icon="angle down"
                className={authorId ? styles.active : null}
                onKeyDown={this.onUserInputHitEnter}
              >
                <Dropdown.Menu>
                  <Input
                    name="author"
                    value={authorDropdownFilter}
                    icon="search"
                    iconPosition="left"
                    className="search"
                    placeholder="Filter authors"
                    onClick={this.onUserInputClick}
                    onChange={this.onUserInputChange}
                  />
                  <Dropdown.Menu scrolling>
                    {filteredAuthorList.map((author, index) => (
                      <Dropdown.Item
                        key={author.id}
                        value={author.id}
                        onClick={this.onAuthorChange}
                        onChange={this.onUserInputChange}
                      >
                        <Icon name="check" className={authorId !== author.id ? styles.hide_check : null} />
                        <img alt="user avatar" src={getUserImgLink(author.imgUrl)} className={styles.avatar} />
                        <span>{author.username}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
              {isIssues && (
                <Dropdown
                  text="Assignee"
                  icon="angle down"
                  className={styles.active}
                  onKeyDown={this.onUserInputHitEnter}
                >
                  <Dropdown.Menu>
                    <Input
                      name="assignee"
                      value={assigneeDropdownFilter}
                      icon="search"
                      iconPosition="left"
                      className="search"
                      placeholder="Filter assignees"
                      onClick={this.onUserInputClick}
                      onChange={this.onUserInputChange}
                    />
                    <Dropdown.Menu scrolling>
                      {filteredAssigneeList.map((assignee, index) => (
                        <Dropdown.Item key={assignee.id} value={assignee.id} onClick={this.onAssigneeChange}>
                          <Icon name="check" className={assigneeId !== assignee.id ? styles.hide_check : null} />
                          <img alt="user avatar" src={getUserImgLink(assignee.imgUrl)} className={styles.avatar} />
                          <span>{assignee.username}</span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              <Dropdown text="Sort" icon="angle down" className={sort ? styles.active : null}>
                <Dropdown.Menu>
                  {sortOptions.map(({ key, text, value }) => (
                    <Dropdown.Item key={key} value={value} onClick={this.onSortChange}>
                      <Icon name="check" className={value !== sort ? styles.hide_check : null}></Icon>
                      <span>{text}</span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <DataList data={items} isPull={!isIssues} />
        </div>
      </Segment>
    ) : (
      <Loader active />
    );
  }
}

IssuesPullsList.propTypes = {
  isIssues: PropTypes.bool,
  reponame: PropTypes.string,
  repositoryId: PropTypes.string,
  data: PropTypes.array,
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

export default withRouter(IssuesPullsList);
