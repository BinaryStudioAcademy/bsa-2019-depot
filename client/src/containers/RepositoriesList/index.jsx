import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

import RepositoryItem from '../../components/RepositoryItem';
import { getRepositories, setStar } from '../../services/repositoryService';

export class RepositoriesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: [],
      loading: true
    };

    this.onStar = this.onStar.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { username }
      }
    } = this.props;
    this.getRepositories(username).then(() => {
      this.setState({ loading: false });
    });
  }

  async getRepositories(username) {
    const repositories = await getRepositories(username);
    const mappedRepositories = this.checkIfStar(repositories);

    this.setState({
      repositories: mappedRepositories
    });
  }

  async onStar(repository) {
    const userId = this.props.id;
    const repositoryId = repository.id;
    const { onDataChange } = this.props;

    const { repositories } = this.state;
    const updatedRepositories = repositories.map(repo => (repository.id === repo.id ? repository : repo));

    this.setState({
      repositories: updatedRepositories
    });
    await setStar({ userId, repositoryId });
    if (onDataChange) onDataChange();
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

  filterRepositories = repositories => {
    const { filter, repoNameFilter } = this.props;
    const value = repoNameFilter.toLowerCase();
    switch (filter) {
    case 'Public':
      return repositories.filter(({ isPublic, name }) => isPublic && name.toLowerCase().includes(value));
    case 'Private':
      return repositories.filter(({ isPublic, name }) => !isPublic && name.toLowerCase().includes(value));
    default:
      return repositories.filter(({ name }) => name.toLowerCase().includes(value));
    }
  };

  render() {
    const { repositories, loading } = this.state;
    const filteredRepositories = this.filterRepositories(repositories);
    const {
      match: {
        params: { username }
      }
    } = this.props;

    return loading ? (
      <Loader active />
    ) : (
      <>
        {filteredRepositories.map(repo => (
          <RepositoryItem repo={repo} key={repo.name} onStar={this.onStar} username={username} />
        ))}
      </>
    );
  }
}

RepositoriesList.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  id: PropTypes.string,
  filter: PropTypes.string,
  onDataChange: PropTypes.func,
  repoNameFilter: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({
  id
});

export default connect(mapStateToProps)(withRouter(RepositoriesList));
