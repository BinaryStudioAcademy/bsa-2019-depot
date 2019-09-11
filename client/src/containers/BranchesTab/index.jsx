import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Loader, Input, Menu, Segment } from 'semantic-ui-react';
import { fetchBranches } from '../../routines/routines';
import BranchesList from '../../components/BranchesList';

import styles from './styles.module.scss';

class BranchesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        type: 'Overview',
        text: ''
      }
    };

    this.filterBranches = this.filterBranches.bind(this);
    this.searchBranches = this.searchBranches.bind(this);
  }

  componentDidMount() {
    const {
      branchesData: { branches },
      repoID
    } = this.props;
    if (!(branches && branches.length)) {
      this.props.fetchBranches({ repoID });
    }
  }

  getBranchStatus = dateString => {
    const branchDate = moment(dateString);
    const now = moment();
    const diff = moment.duration(now.diff(branchDate)).asMonths();
    return diff >= 3 ? 'Stale' : 'Active';
  };

  filterBranches(evt, { name }) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        type: name
      }
    });
  }

  searchBranches(evt) {
    this.setState({
      ...this.state,
      filter: {
        ...this.state.filter,
        text: evt.target.value
      }
    });
  }

  getFilteredBranches = (branches, filter) => {
    const { type, text } = filter;
    let filteredBranches = branches;
    if (text) {
      filteredBranches = branches.filter(branch => branch.name.includes(text));
    }
    switch (type) {
    case 'Active':
    case 'Stale':
      return filteredBranches.filter(branch => branch.status === type);
    case 'Yours':
      return filteredBranches.filter(branch => branch.ownedByCurrentUser);
    case 'Overview':
    default:
      return filteredBranches;
    }
  };

  createNewPullRequest = () => {
    const {
      match: {
        params: { username, reponame }
      },
      history
    } = this.props;
    history.push(`/${username}/${reponame}/compare`);
  };

  renderMenuItems = () => {
    const { filter } = this.state;
    const tabFilters = [
      {
        key: 1,
        text: 'Overview',
        value: 'Overview'
      }
    ];

    return (
      <>
        {tabFilters.map(tabFilter => (
          <Menu.Item
            className={styles.branchMenuItem}
            key={tabFilter.key}
            name={tabFilter.text}
            active={filter.type === tabFilter.value}
            onClick={this.filterBranches}
          />
        ))}
      </>
    );
  };

  render() {
    const {
      branchesData: { loading, branches },
      username,
      match: {
        params: { reponame },
        url
      }
    } = this.props;

    const displayBranches = branches.map(branch => ({
      name: branch.name,
      ...(branch.pullrequests[0] ? { prNumber: branch.pullrequests[0].number } : {}),
      status: this.getBranchStatus(branch.headCommit.createdAt),
      ownedByCurrentUser: username === branch.headCommit.user.username,
      author: branch.headCommit.user.username,
      date: branch.headCommit.createdAt
    }));

    const { filter } = this.state;

    const renderedBranches = this.getFilteredBranches(displayBranches, filter);

    return loading ? (
      <Loader active />
    ) : (
      <>
        <Menu className={styles.branchMenu}>
          {this.renderMenuItems()}
          <Menu.Menu position="right">
            <Menu.Item key="0">
              <Input icon="search" placeholder="Search branches..." onChange={this.searchBranches} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment className={styles.branchesListContainer}>
          <BranchesList
            branches={renderedBranches}
            username={username}
            reponame={reponame}
            createNewPullRequest={this.createNewPullRequest}
            repoUrl={url
              .split('/')
              .slice(0, -1)
              .join('/')}
          />
        </Segment>
      </>
    );
  }
}

BranchesTab.propTypes = {
  branchesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    branches: PropTypes.array
  }).isRequired,
  repoID: PropTypes.string.isRequired,
  fetchBranches: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  username: PropTypes.string,
  reponame: PropTypes.string,
  history: PropTypes.object
};

const mapStateToProps = ({
  branchesData,
  profile: {
    currentUser: { username }
  },
  currentRepo: {
    repository: {
      currentRepoInfo: { id: repoID, name: reponame }
    }
  }
}) => ({
  branchesData,
  username,
  reponame,
  repoID
});

const mapDispatchToProps = {
  fetchBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BranchesTab);
