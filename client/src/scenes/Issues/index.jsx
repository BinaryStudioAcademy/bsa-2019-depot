import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as queryString from 'query-string';
import { Loader, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import IssuesList from '../../components/IssuesList';
import * as issuesService from '../../services/issuesService';

import styles from './styles.module.scss';

const DEFAULT_SORT = 'createdAt_DESC';
const DEFAULT_IS_OPENED = true;
const DEFAULT_OWNER = null;

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

class Issues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      issues: [],
      owners: [],
      openIssuesCount: 0,
      closedIssuesCount: 0,
      filterByTitle: '',
      filter: {
        title: '',
        opened: true
      },
      loading: false,
      error: '',
      isOpened: DEFAULT_IS_OPENED,
      sort: DEFAULT_SORT,
      owner: DEFAULT_OWNER
    };
  }

  async componentDidMount() {
    await this.setState({
      ...this.state,
      isOpened: this.getIsOpenedFromQuery(),
      sort: this.getSortFromQuery(),
      owner: this.getOwnerFromQuery()
    });
    await this.fetchIssues();
  }

  getIsOpenedFromQuery = () => {
    if (!this.props.location.search) {
      return true;
    }
    const isOpenedString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).isOpened;
    return isOpenedString || this.state.isOpened;
  };

  getSortFromQuery = () => {
    if (!this.props.location.search) {
      return 'createdAt_DESC';
    }
    const sortString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).sort;
    return sortString || this.state.sort;
  };
  getOwnerFromQuery = () => {
    if (!this.props.location.search) {
      return null;
    }
    const ownerString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).owner;
    return ownerString || null;
  };

  async fetchIssues() {
    const {
      match: {
        params: { username }
      }
    } = this.props;
    const { isOpened, sort, owner } = this.state;
    try {
      await this.setLoading(true);
      const issuesData = await issuesService.getAllIssues(username, { isOpened, sort, owner });
      const { issues, open, close, owners } = issuesData;
      this.setState({
        ...this.state,
        issues,
        owners,
        openIssuesCount: open,
        closedIssuesCount: close
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

  handleGetOpened = () => {
    this.changeTab(true);
  };

  handleGetClosed = () => {
    this.changeTab(false);
  };

  changeTab = async isOpened => {
    await this.setState({
      ...this.state,
      isOpened
    });
    this.fetchIssues();
    this.updateLink();
  };

  handleOwnerChange = async (e, data) => {
    const owner = data.value.length > 0 ? data.value.join(',') : null;
    await this.setState({
      ...this.state,
      owner
    });
    this.fetchIssues();
    this.updateLink();
  };
  handleSortChange = async (e, data) => {
    const sort = data.value;
    await this.setState({
      ...this.state,
      sort
    });
    this.fetchIssues();
    this.updateLink();
  };

  updateLink() {
    const { location, history } = this.props;
    const { isOpened, sort, owner } = this.state;
    const queryParams = [];
    if (DEFAULT_IS_OPENED !== isOpened) queryParams.push(`isOpened=${isOpened}`);
    if (DEFAULT_SORT !== sort) queryParams.push(`sort=${sort}`);
    if (owner) queryParams.push(`owner=${owner}`);
    if (queryParams.length > 0) {
      const queryParamsStr = queryParams.join('&');
      history.push(`${location.pathname}?${queryParamsStr}`);
    } else {
      history.push(`${location.pathname}`);
    }
  }

  render() {
    const { loading, issues, owners, filterByTitle, openIssuesCount, closedIssuesCount, isOpened, owner } = this.state;

    const ownerMapper = username => {
      return { key: username, text: username, value: username };
    };

    const ownerValues = owner ? owner.split(',') : [];
    const ownersList = owners.map(owner => owner.username).map(ownerMapper);

    const filteredIssues = filterByTitle ? this.renderFilteredIssues() : issues;

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
              <span className={styles.openedIssues + (isOpened ? ' active' : '')} onClick={this.handleGetOpened}>
                <Icon name="info" /> {openIssuesCount} Open
              </span>
              <span className={styles.closedIssues + (!isOpened ? ' active' : '')} onClick={this.handleGetClosed}>
                <Icon name="check" /> {closedIssuesCount} Closed
              </span>
            </div>
            <div className={styles.issueFilters}>
              <Dropdown
                value={ownerValues}
                text="Organization"
                options={ownersList}
                onChange={this.handleOwnerChange}
                multiple
                search
                selection
              ></Dropdown>
              <Dropdown text="Sort" icon="caret down" onChange={this.handleSortChange} options={sortOptions}></Dropdown>
            </div>
          </div>
          <IssuesList issues={filteredIssues} />
        </div>
      </div>
    );
  }
}

Issues.propTypes = {
  error: PropTypes.string,
  match: PropTypes.object,
  issues: PropTypes.array,
  fetchIssues: PropTypes.func,
  loading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  history: PropTypes.object
};

const mapStateToProps = ({ profile: { currentUser } }) => ({
  currentUser
});

export default connect(mapStateToProps)(Issues);
