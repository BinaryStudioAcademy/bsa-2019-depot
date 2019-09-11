import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as queryString from 'query-string';
import { Segment, Loader, Icon, Input, Dropdown, Button } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import * as issuesService from '../../services/issuesService';
import * as pullsService from '../../services/pullsService';

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

const tabs = {
  created: 'Created',
  reviewRequests: 'Review requests'
};

class PersonalIssuesPrs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      owners: [],
      openItemsCount: 0,
      closedItemsCount: 0,
      filterByTitle: '',
      filter: {
        title: '',
        opened: true
      },
      loading: false,
      error: '',
      isOpened: DEFAULT_IS_OPENED,
      sort: DEFAULT_SORT,
      owner: DEFAULT_OWNER,
      activeTab: tabs.created
    };
  }

  componentDidMount() {
    this.setState(
      {
        isOpened: this.getIsOpenedFromQuery(),
        sort: this.getSortFromQuery(),
        owner: this.getOwnerFromQuery(),
        activeTab: this.getActiveTabFromQuery()
      },
      () => {
        this.fetchData();
      }
    );
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

  getActiveTabFromQuery = () => {
    if (!this.props.location.search) {
      return 'Created';
    }
    const activeTabString = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).activeTab;
    return activeTabString || 'Created';
  };

  async fetchData() {
    const {
      match: {
        params: { username }
      },
      isPull
    } = this.props;
    const { isOpened, sort, owner, activeTab } = this.state;

    try {
      this.setState({ loading: true });
      const itemsData = await (isPull
        ? pullsService.getUserPulls(username, {
          isOpened,
          sort,
          owner,
          reviewRequests: activeTab === tabs.reviewRequests
        })
        : issuesService.getAllIssues(username, { isOpened, sort, owner }));

      const { open, close, owners } = itemsData;
      this.setState({
        items: isPull ? itemsData.pulls : itemsData.issues,
        owners,
        openItemsCount: open,
        closedItemsCount: close
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  renderFilteredItems = () => {
    const { filterByTitle, items } = this.state;
    return items.filter(({ title }) => title.includes(filterByTitle));
  };

  filterItems = e => {
    this.setState({ filterByTitle: e.target.value });
  };

  handleGetOpened = () => {
    this.changeTab(true);
  };

  handleGetClosed = () => {
    this.changeTab(false);
  };

  changeTab = isOpened => {
    this.setState({ isOpened }, () => {
      this.fetchData();
      this.updateLink();
    });
  };

  handleOwnerChange = (e, { value }) => {
    const owner = value.length > 0 ? value.join(',') : null;
    this.setState({ owner }, () => {
      this.fetchData();
      this.updateLink();
    });
  };

  handleSortChange = (e, { value: sort }) => {
    this.setState({ sort }, () => {
      this.fetchData();
      this.updateLink();
    });
  };

  handleGetReviewRequests = () => {
    if (this.state.activeTab !== tabs.reviewRequests) {
      this.setState({ activeTab: tabs.reviewRequests }, () => {
        this.fetchData();
        this.updateLink();
      });
    }
  };

  handleGetCreated = () => {
    if (!this.state.activeTab !== tabs.created) {
      this.setState({ activeTab: tabs.created }, () => {
        this.fetchData();
        this.updateLink();
      });
    }
  };

  updateLink() {
    const { location, history } = this.props;
    const { isOpened, sort, owner, activeTab } = this.state;
    const queryParams = [];
    if (DEFAULT_IS_OPENED !== isOpened) queryParams.push(`isOpened=${isOpened}`);
    if (DEFAULT_SORT !== sort) queryParams.push(`sort=${sort}`);
    if (owner) queryParams.push(`owner=${owner}`);
    if (activeTab) queryParams.push(`activeTab=${activeTab}`);
    if (queryParams.length > 0) {
      const queryParamsStr = queryParams.join('&');
      history.push(`${location.pathname}?${queryParamsStr}`);
    } else {
      history.push(`${location.pathname}`);
    }
  }

  render() {
    const {
      loading,
      items,
      owners,
      filterByTitle,
      openItemsCount,
      closedItemsCount,
      isOpened,
      owner,
      activeTab
    } = this.state;
    const { isPull } = this.props;

    const ownerMapper = ({ username }) => {
      return { key: username, text: username, value: username };
    };

    const ownerValues = owner ? owner.split(',') : [];
    const ownersList = owners.map(ownerMapper);

    const filteredItems = filterByTitle ? this.renderFilteredItems() : items;

    return loading ? (
      <Loader active />
    ) : (
      <Segment basic>
        <div className={styles.container}>
          <div className={styles.filterRow}>
            <Button.Group>
              <Button active={activeTab === tabs.created} onClick={this.handleGetCreated}>
                Created
              </Button>
              {!isPull ? <Button>Assigned</Button> : null}
              {isPull && (
                <Button active={activeTab === tabs.reviewRequests} onClick={this.handleGetReviewRequests}>
                  Review requests
                </Button>
              )}
            </Button.Group>
            <Input labelPosition="left" placeholder="Filter by title" onChange={this.filterItems} />
          </div>
          <div className={styles.itemsContainer}>
            <div className={styles.itemsHeader}>
              <div>
                <span className={styles.openedItems + (isOpened ? ' active' : '')} onClick={this.handleGetOpened}>
                  <Icon name="info" /> {openItemsCount} Open
                </span>
                <span className={styles.closedItems + (!isOpened ? ' active' : '')} onClick={this.handleGetClosed}>
                  <Icon name="check" /> {closedItemsCount} Closed
                </span>
              </div>
              <div className={styles.itemFilters}>
                <Dropdown
                  value={ownerValues}
                  text="Organization"
                  options={ownersList}
                  onChange={this.handleOwnerChange}
                  multiple
                  search
                  selection
                />
                <Dropdown text="Sort" icon="caret down" onChange={this.handleSortChange} options={sortOptions} />
              </div>
            </div>
            <DataList data={filteredItems} isPull={isPull} />
          </div>
        </div>
      </Segment>
    );
  }
}

PersonalIssuesPrs.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isPull: PropTypes.bool.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: currentUserId }
  }
}) => ({
  currentUserId
});

export default connect(mapStateToProps)(withRouter(PersonalIssuesPrs));
