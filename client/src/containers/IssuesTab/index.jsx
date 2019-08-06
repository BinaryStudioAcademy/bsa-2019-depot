import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import { fetchIssues } from '../../routines/routines';
import IssuesList from '../../components/IssuesList';

import styles from './styles.module.scss';

const issuesPerPage = 25;

class IssuesTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            filter: {
                author: '',
                labels: [],
                assignees: [],
                opened: true
            }
        };
    }

    componentDidMount() {
        this.props.fetchIssues({
            from: 0,
            to: issuesPerPage,
            filter: this.state.filter
        });
    }

    render() {
        const {
            issuesData: { loading, issues }
        } = this.props;
        return (
            <div className={styles.container}>
                {loading ? (
                    <Dimmer active>
                        <Loader />
                    </Dimmer>
                ) : (
                    <IssuesList issues={issues} />
                )}
            </div>
        );
    }
}

IssuesTab.propTypes = {
    issuesData: PropTypes.exact({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.string,
        issues: PropTypes.array
    }).isRequired,
    fetchIssues: PropTypes.func.isRequired
};

const mapStateToProps = ({ issuesData }) => ({
    issuesData
});

const mapDispatchToProps = {
    fetchIssues
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IssuesTab);
