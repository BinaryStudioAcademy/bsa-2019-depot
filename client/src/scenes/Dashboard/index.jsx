import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Button } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import { repositoryActions } from './actions';
import Overview from '../../containers/Overview';
import RepositoriesList from '../../components/RepositoriesList';

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
      repositoriesNames,
      match: { path, url },
      location: { pathname }
    } = this.props;
    let activePage = pathname.split('/')[3];
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
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={4} computer={4}>
              <div className={styles.avatar_wrapper}>
                <Link to="">
                  <img src="http://cameronmcefee.com/img/work/the-octocat/ironcat.jpg" alt="user_avatar" />
                </Link>
                <Link to="" className={styles.set_status}>
                  <Octicon icon={Smiley} />
                  Set status
                </Link>
              </div>
              <h1 className={styles.username}>octocat</h1>
              <Button fluid basic className={styles.edit_profile}>
                Edit profile
              </Button>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={12}>
              <Container className={styles.navbar_wrapper}>
                <nav className={styles.navbar}>
                  <Link to={url} className={activePage === '' ? styles.active_link : undefined}>
                    Overview
                  </Link>
                  <Link
                    to={`${url}/repositories`}
                    className={activePage === 'repositories' ? styles.active_link : undefined}
                  >
                    Repositories<span>{repositoriesNames.length}</span>
                  </Link>
                  <Link to="">
                    Projects<span>2</span>
                  </Link>
                  <Link to="">
                    Stars<span>128</span>
                  </Link>
                  <Link to="">
                    Followers<span>8</span>
                  </Link>
                  <Link to="">
                    Following<span>19</span>
                  </Link>
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

Dashboard.defaultProps = {};

Dashboard.propTypes = {
  actions: PropTypes.object.isRequired,
  repositoriesNames: PropTypes.array.isRequired,
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

const mapStateToProps = ({ repositories }) => ({
  repositoriesNames: repositories.repositoriesNames
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
