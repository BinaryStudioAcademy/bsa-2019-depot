import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader, Input, Button, Dropdown } from 'semantic-ui-react';
import { fetchBranches } from '../../routines/routines';
// import BranchesList from '../../components/BranchesList';

import styles from './styles.module.scss';

class BranchesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        type: '',
        text: ''
      }
    };
  }

  componentDidMount() {
    this.props.fetchBranches({
      owner: this.props.username,
      repoName: this.props.match.params.reponame,
      filter: this.state.filter
    });
  }

  render() {
    const {
      branchesData: { loading, branches }
    } = this.props;

    // generate mock PR status
    const displayBranches = branches.map((branch, idx) => ({
      name: branch,
      merged:
        idx % 2
          ? null
          : {
            number: idx * 3
          }
    }));

    const tabFilters = [
      {
        key: 0,
        text: 'Overview',
        value: 'Overview'
      },
      {
        key: 1,
        text: 'Yours',
        value: 'Yours'
      },
      {
        key: 2,
        text: 'Active',
        value: 'Active'
      },
      {
        key: 3,
        text: 'Stale',
        value: 'Stale'
      }
    ];

    return loading ? (
      <Loader active />
    ) : (
      <>
        <div className={styles.filterRow}>
          <Input
            label={<Dropdown text="Filters" options={tabFilters} />}
            labelPosition="left"
            placeholder="Filter by title"
          />
          <Button content="New Issue" primary />
        </div>
        <div>
          {displayBranches.map((branch, idx) => (
            <p key={idx}>
              {branch.name} {branch.merged && branch.merged.number}
            </p>
          ))}
        </div>
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
  fetchBranches: PropTypes.func.isRequired,
  match: PropTypes.object,
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
