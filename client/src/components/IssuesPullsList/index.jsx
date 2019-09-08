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
        sort: 'created_desc'
      },
      labelsCount: 0,
      openCount: 0,
      closedCount: 0,
      authorList: [],
      loading: true,
      authorDropdownFilter: ''
    };
  }

  fetchData = async () => {
    const { repositoryId, isIssues } = this.props;
    const { filter } = this.state;
    const labelsCount = (await getLabels(repositoryId)).length;

    if (isIssues) {
      const { openCount, closedCount, authors: authorList, issues: items } = await RepoService.getRepositoryIssues(
        repositoryId,
        filter
      );
      this.setState({ openCount, closedCount, authorList, items, labelsCount, loading: false });
    } else {
      const { openCount, closedCount, authors: authorList, pulls: items } = await RepoService.getRepositoryPulls(
        repositoryId,
        filter
      );
      this.setState({ isIssues, openCount, closedCount, authorList, items, labelsCount, loading: false });
    }
  };

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

  onTitleChange = (e, { value }) => {
    this.setState({ filter: { ...this.state.filter, title: value } });
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
    await this.setState({ authorDropdownFilter: value });
  };

  onUserInputHitEnter = async e => {
    if (e.key === 'Enter') {
      const { authorList, authorDropdownFilter } = this.state;
      const filteredAuthorList = authorList.filter(author => author.username.includes(authorDropdownFilter));
      if (filteredAuthorList.length > 0) {
        await this.setState({
          authorDropdownFilter: '',
          filter: { ...this.state.filter, authorId: filteredAuthorList[0].id }
        });
        this.fetchData();
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
      filter: { title, isOpened, authorId, sort },
      openCount,
      closedCount,
      authorDropdownFilter,
      authorList,
      labelsCount,
      loading
    } = this.state;

    const filteredAuthorList = authorList.filter(author => author.username.includes(authorDropdownFilter));

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
                      <Dropdown.Item key={author.id} value={author.id} onClick={this.onAuthorChange}>
                        <Icon name="check" className={authorId !== author.id ? styles.hide_check : null} />
                        <img alt="user avatar" src={getUserImgLink(author.imgUrl)} className={styles.avatar} />
                        <span>{author.username}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown text="Assignee" icon="angle down">
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
