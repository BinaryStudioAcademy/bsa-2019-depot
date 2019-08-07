import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimmer, Dropdown, Loader } from 'semantic-ui-react';
import CommitsList from '../../components/CommitsList';
import { fetchCommits, fetchBranches } from '../../routines/routines';

import styles from './styles.module.scss';

class CommitsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            branch: 'master'
        };
    }

    componentDidMount() {
        this.props.fetchBranches({
            repoName: this.props.repoName
        });
        this.props.fetchCommits({
            branch: this.state.branch
        });
    }

    render() {
        const { commitData, branchData } = this.props.commitData;
        const branchOptions = branchData.branches.map((branch, index) => ({
            key: index,
            text: branch.name,
            value: branch.name
        }));

        return commitData.loading || branchData.loading ? (
            <Dimmer active>
                <Loader />
            </Dimmer>
        ) : (
            <div className={styles.commitsContainer}>
                <div className="branchSelectRow">
                    <Dropdown text="Branches" options={branchOptions} />
                </div>
                <CommitsList commits={commitData.commits} />
            </div>
        );
    }
}

CommitsPage.propTypes = {
    commitData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        commits: PropTypes.array
    }).isRequired,
    branchData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        branches: PropTypes.array
    }).isRequired,
    repoName: PropTypes.string.isRequired,
    fetchCommits: PropTypes.func.isRequired,
    fetchBranches: PropTypes.func.isRequired
};

const mapStateToProps = ({ commitData, branchData, repoName }) => ({
    commitData,
    branchData,
    repoName
});

const mapDispatchToProps = {
    fetchCommits,
    fetchBranches
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommitsPage);
