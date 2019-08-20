import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import { parse } from 'query-string';
import { repositoryActions } from './actions';
import Overview from '../../containers/Overview';
import OrganizationDashboard from '../OrganizationDashboard';
import RepositoriesList from '../../components/RepositoriesList';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import { getUserImgLink } from '../../helpers/imageHelper';
import { getUser } from '../../services/userService';

import styles from './styles.module.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      repoCount: 0,
      currentUser: {}
    };
  }

  componentDidMount() {
    const { actions, match } = this.props;
    const userToRender = match.params.username;
    actions.fetchRepositories({
      limit: '',
      filterWord: '',
      userToRender
    });

    this.getUserInfo(userToRender);
  }

  async getUserInfo(userToRender) {
    const data = await getUser({ userToRender });
    this.setState({ currentUser: data });
  }

  render() {
    const {
      match: { url, params },
      location: { search },
      username,
      name,
      imgUrl,
      repositories,
      projects,
      stars,
      followers,
      following
    } = this.props;
    const repoCount = repositories.length;
    const isOwner = this.state.currentUser.username === username;
    const userType = this.state.currentUser.type;
    const { tab } = parse(search);

    return userType === 'ORG' ? (
      <OrganizationDashboard />
    ) : (
      <Container className={styles.wrapper}>
        <Divider hidden />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={4} computer={4}>
              <div className={styles.avatar_wrapper}>
                <Link to="">
                  <img src={getUserImgLink(imgUrl)} alt="user_avatar" />
                </Link>
                <Link to="" className={styles.set_status}>
                  <Octicon icon={Smiley} />
                  Set status
                </Link>
              </div>
              <div className={styles.namesContainer}>
                {name ? <h1 className={styles.name}>{name}</h1> : null}
                <h1 className={styles.username}>{params.username}</h1>
              </div>
              <Link to="/settings/profile">
                <Button fluid basic className={styles.edit_profile}>
                  Edit profile
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={12}>
              <Container className={styles.navbar_wrapper}>
                <nav className={styles.navbar}>
                  <Link to={url} className={!tab ? styles.active_link : undefined}>
                    Overview
                  </Link>
                  <Link
                    to={`${url}?tab=repositories`}
                    className={tab === 'repositories' ? styles.active_link : undefined}
                  >
                    Repositories{repoCount ? <span>{repoCount}</span> : null}
                  </Link>
                  <Link to="">Projects{projects ? <span>{projects}</span> : null}</Link>
                  <Link to="">Stars{stars ? <span>{stars}</span> : null}</Link>
                  <Link to="">Followers{followers ? <span>{followers}</span> : null}</Link>
                  <Link to="">Following{following ? <span>{following}</span> : null}</Link>
                </nav>
              </Container>
              {!tab && <Overview repositories={repositories} userToRender={params.username} />}
              {tab === 'repositories' && (
                <>
                  <RepositoriesFilters />
                  <RepositoriesList repositories={repositories} isOwner={isOwner} />
                </>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

Dashboard.defaultProps = {
  imgUrl: 'https://avatars3.githubusercontent.com/u/32107863?s=460&v=4',
  repositories: [],
  projects: 0,
  stars: 0,
  followers: 0,
  following: 0
};

Dashboard.propTypes = {
  actions: PropTypes.object.isRequired,
  repositories: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string,
  imgUrl: PropTypes.string,
  projects: PropTypes.number.isRequired,
  stars: PropTypes.number.isRequired,
  followers: PropTypes.number.isRequired,
  following: PropTypes.number.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  })
};

const mapStateToProps = ({ userStats: { repositories }, profile: { currentUser } }) => ({
  name: currentUser.name,
  username: currentUser.username,
  imgUrl: currentUser.imgUrl,
  repositories
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...repositoryActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
