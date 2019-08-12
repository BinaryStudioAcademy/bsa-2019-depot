import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';
import { repositoryActions } from '../../scenes/Dashboard/actions';
import { RepositoryItem } from '../RepositoryItem';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
    componentDidMount() {
        const { actions } = this.props;
        actions.fetchRepositories({
            limit: '',
            filterWord: ''
        });
    }

    render() {
        const { repositoriesNames } = this.props;
        //Mock

        const repoTypes = [
            { key: 'rt_1', text: 'Type: All', value: 'All' },
            { key: 'rt_2', text: 'Type: Public', value: 'Public' },
            { key: 'rt_3', text: 'Type: Private', value: 'Private' }
        ];

        const languageTypes = [
            { key: 'lt_1', text: 'JavaScript', value: 'JavaScript' },
            { key: 'lt_2', text: 'HTML', value: 'HTML' },
            { key: 'lt_3', text: 'CSS', value: 'CSS' }
        ];

        return (
            <Container className={styles.favorite_repos_wrapper}>
                <Container className={styles.repos_filters}>
                    <Input placeholder="Find a repository…" className={styles.repos_search_input}></Input>
                    <div>
                        <Dropdown
                            placeholder="Type: All"
                            fluid
                            selection
                            options={repoTypes}
                            className={styles.repos_filters_dropdown}
                        />
                    </div>
                    <div>
                        <Dropdown
                            placeholder="Language"
                            fluid
                            selection
                            options={languageTypes}
                            className={styles.repos_filters_dropdown}
                        />
                    </div>
                    <div className={styles.new_repo_wrapper}>
                        <Link to="">
                            <Button className={styles.new_repo}>
                                <Octicon icon={Repo} />
                New
                            </Button>
                        </Link>
                    </div>
                </Container>
                {repositoriesNames.map(repo => {
                    return <RepositoryItem repo={repo} key={repo} />;
                })}
            </Container>
        );
    }
}

RepositoriesList.defaultProps = {
    repoTypes: PropTypes.array.isRequired,
    languageTypes: PropTypes.array.isRequired
};

RepositoriesList.propTypes = {
    actions: PropTypes.object.isRequired,
    repositoriesNames: PropTypes.array.isRequired
};

const mapStateToProps = ({ repositories }) => ({
    repositoriesNames: repositories.repositoriesNames
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ ...repositoryActions }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RepositoriesList);
