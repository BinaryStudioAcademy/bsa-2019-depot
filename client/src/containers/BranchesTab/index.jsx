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
      match: {
        params: { username, reponame }
      }
    } = this.props;
    if (!(branches && branches.length)) {
      this.props.fetchBranches({ owner: username, repoName: reponame });
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

  renderMenuItems = () => {
    const { filter } = this.state;
    const tabFilters = [
      {
        key: 1,
        text: 'Overview',
        value: 'Overview'
      },
      {
        key: 2,
        text: 'Yours',
        value: 'Yours'
      },
      {
        key: 3,
        text: 'Active',
        value: 'Active'
      },
      {
        key: 4,
        text: 'Stale',
        value: 'Stale'
      }
    ];

    return (
      <>
        {tabFilters.map(tabFilter => (
          <Menu.Item
            className={styles.branchMenuItem}
            key={tabFilter.id}
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
      branchesData: { loading, branches, lastCommits },
      username,
      match: {
        params: { reponame }
      }
    } = this.props;

    const displayBranches = branches.map((branch, idx) => ({
      name: branch,
      // generate mock PR status
      merged:
        idx % 2
          ? null
          : {
            number: idx * 3,
            status: idx % 4 === 1 ? 'Merged' : 'Open'
          },
      status: this.getBranchStatus(lastCommits[branch].date),
      ownedByCurrentUser: username === lastCommits[branch].author,
      author: lastCommits[branch].author,
      date: lastCommits[branch].date
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
          <BranchesList branches={renderedBranches} username={username} reponame={reponame} />
        </Segment>
      </>
    );
  }
}

BranchesTab.propTypes = {
  branchesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    branches: PropTypes.array,
    lastCommits: PropTypes.object.isRequired
  }).isRequired,
  fetchBranches: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  username: PropTypes.string
};

const mapStateToProps = ({
  branchesData,
  profile: {
    currentUser: { username }
  }
}) => ({
  branchesData,
  username
});

const mapDispatchToProps = {
  fetchBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BranchesTab);
