import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
// import { Loader, Icon, Input, Button } from 'semantic-ui-react';
// import { fetchBranches } from '../../routines/routines';
// import BranchesList from '../../components/BranchesList';

// import styles from './styles.module.scss';

class BranchesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        name: '',
        type: ''
      }
    };
  }

  componentDidMount() {
    // this.props.fetchBranches({
    //   filter: this.state.filter
    // });
  }

  render() {
    const {
      branchesData: { loading }

      // branchesData: { loading, issues, branches }
    } = this.props;

    // Generate mock status
    // const displayBranches = branches.map((branch, idx) => ({
    //   ...branch,
    //   merged:
    //     idx % 2
    //       ? null
    //       : {
    //         number: idx * 3
    //       }
    // }));

    // const tabFilters = [
    //   {
    //     key: 0,
    //     text: 'Yours',
    //     value: 'Yours'
    //   },
    //   {
    //     key: 1,
    //     text: 'Stale',
    //     value: 'Stale'
    //   },
    //   {
    //     key: 2,
    //     text: 'Active',
    //     value: 'Active'
    //   }
    // ];

    return loading ? <Loader active /> : <></>;
  }
}

BranchesTab.propTypes = {
  branchesData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    branches: PropTypes.array
  }).isRequired,
  fetchIssues: PropTypes.func.isRequired
};

const mapStateToProps = ({ branchesData }) => ({
  branchesData
});

const mapDispatchToProps = {
  // fetchBranches
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BranchesTab);
