import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import RepositoryItem from '../../components/RepositoryItem';
import { getStars } from '../../services/userService';
import { setStar } from '../../services/repositoryService';

import styles from './styles.module.scss';

class StarsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repositories: []
    };

    this.onStar = this.onStar.bind(this);
  }

  componentDidMount() {
    const { match: { params: { username } } } = this.props;
    this.getStars(username);
  }

  async getStars(username) {
    const stars = await getStars(username);
    const repositories = stars.map(({ repository }) => ({ ...repository, isStar: true }));

    this.setState({
      ...this.state,
      repositories
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

  render() {
    const { repositories } = this.state;
    const { match: { params: { username } } } = this.props;

    return (
      <>
        <div className={styles.tabHeader}>
          <h2>Repositories</h2>
        </div>
        <div>
          {repositories.map(repo => (
            <RepositoryItem
              repo={repo}
              key={repo.name}
              onStar={this.onStar}
              username={username}
              type="stars"
            />
          ))}
        </div>
      </>
    );
  }
};

StarsTab.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
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
)(withRouter(StarsTab));
