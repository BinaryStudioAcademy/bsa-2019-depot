import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Divider } from 'semantic-ui-react';
import { parse } from 'query-string';
import Overview from '../../containers/Overview';
import RepositoriesList from '../../containers/RepositoriesList';
import StarsTab from '../../containers/StarsTab';
import UserInfo from '../../components/UserInfo';
import DashboardHeader, { tabs } from '../../components/DashboardHeader';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import { getUserDetailed } from '../../services/userService';
import Spinner from '../../components/Spinner';
import OrganizationDashboard from '../OrganizationDashboard';

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
  }

  componentDidMount() {
    const {
      match: {
        params: { username }
      }
    } = this.props;
    this.getUserData(username);
  }

  renderTab(tab) {
    switch (tab) {
    case tabs.repositories:
      return (
          <>
            <RepositoriesFilters />
            <RepositoriesList />
          </>
      );
    case tabs.projects:
      return <div>Hello! Projects are there</div>;
    case tabs.stars:
      return <StarsTab />;
    case tabs.following:
      return <div>Following</div>;
    case tabs.followers:
      return <div>followers</div>;
    default:
      return <Overview />;
    }
  }

  render() {
    const {
      userData,
      userData: {
        name,
        username,
        imgUrl,
        repositoriesCount,
        projectsCount,
        starsCount,
        followersCount,
        followingCount,
        type
      }
    } = this.state;

    const {
      location: { search },
      match: { url }
    } = this.props;
    const { tab } = parse(search);

    if (!type) {
      return <Spinner />;
    }

    return type === 'ORG' ? (
      <OrganizationDashboard userData={userData} />
    ) : (
      <Container>
        <Divider hidden />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column mobile={16} tablet={4} computer={4}>
              <UserInfo username={username} name={name} imgUrl={imgUrl} />
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
}

Dashboard.propTypes = {
  location: PropTypes.exact({
    key: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default Dashboard;
