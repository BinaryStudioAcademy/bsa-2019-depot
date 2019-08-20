import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Divider } from 'semantic-ui-react';
import { parse } from 'query-string';
// import Overview from '../../containers/Overview';
import RepositoriesList from '../../components/RepositoriesList';
import StarsTab from '../../containers/StarsTab';
import UserInfo from '../../components/UserInfo';
import DashboardHeader, { tabs } from '../../components/DashboardHeader';
import { getUserDetailed } from '../../services/userService';

import styles from './styles.module.scss';


const initialUserData = {};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: initialUserData
    };
  }

  async getUserData(username) {
    const userData = await getUserDetailed(username);
    this.setState({
      ...this.state,
      userData
    });
  };

  componentDidMount() {
    const { match: { params: { username } } } = this.props;
    this.getUserData(username);
  }

  renderTab(tab) {
    switch (tab) {
    case tabs.repositories:
      return <div>RepositoriesList</div>;
    case tabs.projects:
      return <div>Hello! Projects are there</div>;
    case tabs.stars:
      return <div>Stars tab</div>;
    case tabs.following:
      return <div>Following</div>;
    case tabs.followers:
      return <div>followers</div>;
    default:
      return <div>I'm Overview</div>;
    }
  };

  render() {
    const {
      userData: {
        name,
        username,
        imgUrl,
        repositoriesCount,
        projectsCount,
        starsCount,
        followersCount,
        followingCount
      }
    } = this.state;

    const {
      location: { search },
      match: { url }
    } = this.props;
    const { tab } = parse(search);

    return (
      <Container className={styles.wrapper}>
        <Divider hidden />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={4} computer={4}>
              <UserInfo
                username={username}
                name={name}
                imgUrl={imgUrl}
              />
            </Grid.Column>

            <Grid.Column mobile={16} tablet={12} computer={12}>
              <DashboardHeader
                baseUrl={url}
                activeTab={tab}
                repoCount={repositoriesCount}
                projectsCount={projectsCount}
                starsCount={starsCount}
                followersCount={followersCount}
                followingCount={followingCount}
              />
              {this.renderTab(tab)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
};

Dashboard.propTypes = {
  location: {
    search: PropTypes.string
  },
  match: {
    url: PropTypes.string.isRequired
  }
};

export default Dashboard;
