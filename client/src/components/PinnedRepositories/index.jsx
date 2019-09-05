import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import StarLink from '../StarLink';
import Octicon, { Repo } from '@primer/octicons-react';
import { Card } from 'semantic-ui-react';
import PinnableRepos from '../PinnableRepos';
import * as UserService from '../../services/userService';

import styles from './styles.module.scss';

class PinnedRepositories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    this.getRepositories(userId);
  }

  async getRepositories(userId) {
    const data = await UserService.getPinnedRepos(userId);
    this.setState({
      ...this.state,
      ...data,
      loading: false
    });
  }

  renderItem(username, repo) {
    let {
      repository: { name, starsCount, description }
    } = repo;
    starsCount = Number(starsCount);

    return (
      <Card key={name}>
        <Card.Content>
          <Card.Header>
            <Octicon className={styles.pinnedIcon} icon={Repo} />
            <Link to={`${username}/${name}`} className={styles.repo_name}>
              {name}
            </Link>
          </Card.Header>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          {true ? (
            <span className={styles.repo_info_item}>
              <StarLink href={`${username}/${name}/stargazers`} starsCount={starsCount} />
            </span>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { username } = this.props;
    const { pinnedRepos, popularRepos, loading } = this.state;

    if (loading) {
      return <div>loading...</div>;
    }

    if (!pinnedRepos && !popularRepos) {
      return null;
    }

    const repositories = pinnedRepos || popularRepos.map(repo => ({ repository: repo }));

    return (
      <>
        <div className={styles.pinnedHeader}>
          <h2 className={styles.pinnedTitle}>{pinnedRepos ? 'Pinned' : 'Popular repositories'}</h2>
          <PinnableRepos username={username} />
        </div>
        <Card.Group itemsPerRow={2} stackable={true}>
          {repositories.map(repo => this.renderItem(username, repo))}
        </Card.Group>
      </>
    );
  }
}

PinnedRepositories.propTypes = {
  username: PropTypes.string,
  userId: PropTypes.string
};

export default PinnedRepositories;
