import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Divider } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import { repositoryActions } from './actions';
import Overview from '../../containers/Overview';
import RepositoriesList from '../../components/RepositoriesList';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      repoCount: 0
    };

    this.overviewRouteRender = this.overviewRouteRender.bind(this);
    this.repositoriesListRender = this.repositoriesListRender.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchRepositories({
      limit: '',
      filterWord: ''
    });
  }

  overviewRouteRender = props => {
    const { repositoriesNames } = this.props;
    return <Overview {...props} repositories={repositoriesNames} />;
  };

  repositoriesListRender = props => {
    const { repositoriesNames } = this.props;
    return <RepositoriesList {...props} repositories={repositoriesNames} />;
  };

  render() {
    const {
      match: { path, url },
      location: { pathname },
      username,
      imgUrl,
      repositoriesNames,
      projects,
      stars,
      followers,
      following
    } = this.props;
    const repoCount = repositoriesNames.length;
    let activePage = pathname.split('/')[2];
    // For future tabs
    switch (activePage) {
    case 'repositories':
      activePage = 'repositories';
      break;
    default:
      activePage = '';
    }
    return (
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
              <h1 className={styles.username}>{username}</h1>
              <Link to="/settings/profile">
                <Button fluid basic className={styles.edit_profile}>
                  Edit profile
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={12}>
              <Container className={styles.navbar_wrapper}>
                <nav className={styles.navbar}>
                  <Link to={url} className={activePage === '' && styles.active_link}>
                    Overview
                  </Link>
                  <Link to={`${url}/repositories`} className={activePage === 'repositories' && styles.active_link}>
                    Repositories{repoCount ? <span>{repoCount}</span> : null}
                  </Link>
                  <Link to="">Projects{projects ? <span>{projects}</span> : null}</Link>
                  <Link to="">Stars{stars ? <span>{stars}</span> : null}</Link>
                  <Link to="">Followers{followers ? <span>{followers}</span> : null}</Link>
                  <Link to="">Following{following ? <span>{following}</span> : null}</Link>
                </nav>
              </Container>
              <Switch>
                <Route exact path={path} render={this.overviewRouteRender} />
                <Route exact path={`${path}/repositories`} render={this.repositoriesListRender} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

Dashboard.defaultProps = {
  imgUrl: 'https://avatars3.githubusercontent.com/u/32107863?s=460&v=4',
  repositoriesNames: [],
  projects: 0,
  stars: 0,
  followers: 0,
  following: 0
};

Dashboard.propTypes = {
  actions: PropTypes.object.isRequired,
  repositoriesNames: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
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

const mapStateToProps = ({ userStats: { repositoriesNames }, profile: { currentUser } }) => ({
  username: currentUser.username,
  imgUrl: currentUser.imgUrl,
  repositoriesNames
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
