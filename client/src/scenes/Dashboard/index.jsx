import React from 'react';
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
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchRepositories({
      limit: '',
      filterWord: ''
    });
  }

  getRepoCount = repositoriesNames => {
    return repositoriesNames.length;
  };

  render() {
    const { repositoriesNames } = this.props;
    let params = new URLSearchParams(this.props.location.search);
    let tab = params.get('tab');
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
                  <Link to="/dashboard" className={!tab ? styles.active_link : undefined}>
                    Overview
                  </Link>
                  <Link
                    to={{ pathname: '/dashboard', search: '?tab=repositories' }}
                    className={tab === 'repositories' ? styles.active_link : undefined}
                  >
                    Repositories<span>{this.getRepoCount(repositoriesNames)}</span>
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
              {(tab === 'repositories' && <RepositoriesList repositories={repositoriesNames} />) || (
                <Overview repositories={repositoriesNames} />
              )}
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
