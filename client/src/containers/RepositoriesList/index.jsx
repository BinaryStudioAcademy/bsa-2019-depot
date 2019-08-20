import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';
import RepositoryItem from '../../components/RepositoryItem';
import { getRepositories, setStar } from '../../services/repositoryService';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: []
    };

    this.onStar = this.onStar.bind(this);
  }

  componentDidMount() {
    const { match: { params: { username } } } = this.props;
    this.getRepositories(username);
  }

  async getRepositories(username) {
    const repositories = await getRepositories(username);
    const mappedRepositories = this.checkIfStar(repositories);

    this.setState({
      ...this.state,
      repositories: mappedRepositories
    });
  }

  onStar(repository) {
    const userId = this.props.id;
    const repositoryId = repository.id;

    const { repositories } = this.state;
    const updatedRepositories = repositories.map(repo => repository.id === repo.id ? repository : repo);

    this.setState({
      ...this.state,
      repositories: updatedRepositories
    });
    setStar({ userId, repositoryId });
  }

  checkIfStar(repositories) {
    const { id } = this.props;
    const mappedRepositories = repositories.map(repo => {
      const { stars } = repo;
      if (!stars.length) {
        return repo;
      }

      const isStar = stars.find(({ userId }) => {
        return id === userId;
      });
      if (!isStar) return repo;

      return {
        ...repo,
        isStar: Boolean(isStar)
      };
    });

    return mappedRepositories;
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
              onStar={this.onStar}
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
      username: PropTypes.string
    }
  },
  id: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({
  id
});

export default connect(
  mapStateToProps
)(withRouter(RepositoriesList));
