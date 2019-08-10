import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Star, Repo } from '@primer/octicons-react';
import { repositoryActions } from './actions';
import { LineChart, Line } from 'recharts';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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
        const data = [
            { name: 'commit1', uv: 4000, commitDate: 0, amt: 2400 },
            { name: 'commit2', uv: 3000, commitDate: 0, amt: 2210 },
            { name: 'commit3', uv: 2000, commitDate: 0, amt: 2290 },
            { name: 'commit4', uv: 2780, commitDate: 0, amt: 2000 },
            { name: 'commit5', uv: 1890, commitDate: 0, amt: 2181 },
            { name: 'commit6', uv: 2390, commitDate: 0, amt: 2500 },
            { name: 'commit7', uv: 3490, commitDate: 3800, amt: 2100 },
            { name: 'commit8', uv: 3490, commitDate: 0, amt: 2100 }
        ];

        const repoTypes = [
            { key: 0, text: 'Type: All', value: 'All' },
            { key: 1, text: 'Type: Public', value: 'Public' },
            { key: 2, text: 'Type: Private', value: 'Private' }
        ];

        const languageTypes = [
            { key: 0, text: 'JavaScript', value: 'JavaScript' },
            { key: 1, text: 'HTML', value: 'HTML' },
            { key: 2, text: 'CSS', value: 'CSS' }
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
                    return (
                        <div key={repo} className={styles.pinned_item}>
                            <div className={styles.pinned_item_left}>
                                <div>
                                    <Link to="" className={styles.repo_name}>
                                        {repo}
                                    </Link>
                                </div>
                                <div className="repo-info">
                                    <p className={styles.pinned_item_lang}>
                                        <span></span>JavaScript
                                    </p>
                                    <p className={styles.pinned_item_updated}>Updated 11 days ago</p>
                                </div>
                            </div>
                            <div className={styles.pinned_item_right}>
                                <div>
                                    <button className={styles.pinned_item_stars}>
                                        <Octicon className={styles.star_icon} icon={Star} />
                    Star
                                    </button>
                                </div>
                                <LineChart width={155} height={25} data={data}>
                                    <Line type="monotone" dataKey="commitDate" stroke="#D7ECAD" strokeWidth={2} dot={null} />
                                </LineChart>
                            </div>
                        </div>
                    );
                })}
            </Container>
        );
    }
}

RepositoriesList.defaultProps = {};

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
