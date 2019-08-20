import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';
import RepositoryItem from '../../components/RepositoryItem';
import { getRepositories } from '../../services/repositoryService';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: []
    };
  }

  async getRepositories(username) {
    const repositories = await getRepositories(username);
    this.setState({
      ...this.state,
      repositories
    });
  }

  componentDidMount() {
    const { match: { params: { username } } } = this.props;
    this.getRepositories(username);
  }

  render() {
    const { repositories } = this.state;

    return (
      <div>
        <div className={styles.filters}>
          <Input placeholder="Find a repository…" className={styles.repos_search_input}></Input>
          <div>
            <Dropdown
              placeholder="Type: All"
              fluid
              selection
              className={styles.repos_filters_dropdown}
            />
          </div>
          <div>
            <Dropdown
              placeholder="Language"
              fluid
              selection
              className={styles.repos_filters_dropdown}
            />
          </div>
          <div className={styles.new_repo_wrapper}>
            <Link to="/new">
              <Button className={styles.new_repo}>
                <Octicon icon={Repo} />
                New
              </Button>
            </Link>
          </div>
        </div>
        {repositories.map(repo => {
          return (
            <RepositoryItem
              repo={repo}
              key={repo.name}
            />
          );
        })}
      </div>
    );
  }
}

RepositoriesList.propTypes = {
  match: {
    params: {
      username:PropTypes.string
    }
  }
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, id }
  }
}) => ({
  username,
  id
});

export default connect(
  mapStateToProps
)(withRouter(RepositoriesList));
