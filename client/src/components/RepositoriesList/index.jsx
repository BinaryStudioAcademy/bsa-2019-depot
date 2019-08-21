import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { repositoryActions } from '../../scenes/Dashboard/actions';
import { RepositoryItem } from '../RepositoryItem';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
  render() {
    const { repositories, username, currentOrg } = this.props;

    return (
      <Container className={styles.favorite_repos_wrapper}>
        {repositories.map(repo => {
          return <RepositoryItem repo={repo} orgInfo={currentOrg} username={username} key={repo.name} />;
        })}
      </Container>
    );
  }
}

RepositoriesList.defaultProps = {
  repoTypes: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  languageTypes: PropTypes.array.isRequired
};

RepositoriesList.propTypes = {
  actions: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  repositories: PropTypes.array,
  repo: PropTypes.object,
  currentOrg: PropTypes.object
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  },
  userStats: { repositories }
}) => ({
  repositories,
  username
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
