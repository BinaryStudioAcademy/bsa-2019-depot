import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';
import RepositoryItem from '../../components/RepositoryItem';

import styles from './styles.module.scss';

export class RepositoriesList extends React.Component {
  render() {
    const { repositories, username, id, actions: { setStar } } = this.props;
    return (
      <Container className={styles.favorite_repos_wrapper}>
        <Container className={styles.repos_filters}>
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
        </Container>
        {repositories.map(repo => {
          return (
            <RepositoryItem
              repo={repo}
              username={username}
              key={repo.name}
              onStar={setStar}
              currentUserId={id}
            />
          );
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
  repositories: PropTypes.array.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, id }
  },
  userStats: { repositories }
}) => ({
  repositories,
  username,
  id
});

const mapDispatchToProps = dispatch => {
  return {
    // actions: bindActionCreators({ ...repositoryActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepositoriesList);
