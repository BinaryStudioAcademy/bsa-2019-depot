import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import StarLink from '../StarLink';
import Octicon, { Repo } from '@primer/octicons-react';
import { Card, Loader } from 'semantic-ui-react';
import PinnableRepos from '../PinnableRepos';
import * as UserService from '../../services/userService';

import styles from './styles.module.scss';

const initialState = {
  popularRepos: null,
  pinnedRepos: null,
  loading: true
};

class PinnedRepositories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };

    this.getRepositories = this.getRepositories.bind(this);
  }

  fetchData() {
    this.getRepositories();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps) {
      return false;
    }
    if (this.props.userId !== prevProps.userId) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async getRepositories() {
    const { userId } = this.props;
    this.setState(initialState);
    const data = await UserService.getPinnedRepos(userId);

    this.setState({
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
          <Card.Header className={styles.pinnedItemHeader}>
            <Octicon className={styles.pinnedIcon} icon={Repo} />
            <Link to={`${username}/${name}`} className={styles.repo_name}>
              {name}
            </Link>
          </Card.Header>
          <Card.Description className={styles.pinnedItemDescription}>{description}</Card.Description>
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
    const { username, userId, currentUserId } = this.props;
    const { pinnedRepos, popularRepos, loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    if ((!pinnedRepos || !pinnedRepos.length) && (!popularRepos || !popularRepos.length)) {
      return null;
    }

    const isOwner = userId === currentUserId;
    const repositories = pinnedRepos || popularRepos.map(repo => ({ repository: repo }));

    return (
      <>
        <div className={styles.pinnedHeader}>
          <h2 className={styles.pinnedTitle}>{pinnedRepos ? 'Pinned' : 'Popular repositories'}</h2>
          {isOwner ? (
            <PinnableRepos username={username} pinnedRepos={pinnedRepos} onSetPinned={this.getRepositories} />
          ) : null}
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
  userId: PropTypes.string,
  currentUserId: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: currentUserId }
  }
}) => ({ currentUserId });

export default connect(mapStateToProps)(PinnedRepositories);
