import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Divider } from 'semantic-ui-react';
import { parse } from 'query-string';
import Overview from '../../containers/Overview';
import RepositoriesList from '../../containers/RepositoriesList';
import StarsTab from '../../containers/StarsTab';
import UserInfo from '../../components/UserInfo';
import AdditionalUserInfo from '../../components/AdditionalUserInfo';
import DashboardHeader, { tabs } from '../../components/DashboardHeader';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import { getUserDetailed, getUsersOrganizations } from '../../services/userService';
import Spinner from '../../components/Spinner';
import OrganizationDashboard from '../OrganizationDashboard';

const initialUserData = {};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: initialUserData,
      userOrgs: [],
      filter: 'All'
    };

    this.getUserData = this.getUserData.bind(this);
    this.getUsersOrgs = this.getUsersOrgs.bind(this);
    this.getCurrentRepoFilter = this.getCurrentRepoFilter.bind(this);
  }

  async getUserData() {
    const {
      match: {
        params: { username }
      }
    } = this.props;

    const userData = await getUserDetailed(username);
    this.setState({
      ...this.state,
      userData
    });
  }

  async getUsersOrgs() {
    const {
      userData: { id }
    } = this.state;

    const userOrgs = await getUsersOrganizations(id);
    this.setState({
      ...this.state,
      userOrgs
    });
  }

  async componentDidMount() {
    await this.getUserData();
    await this.getUsersOrgs();
  }

  getCurrentRepoFilter(e, { value: filter }) {
    this.setState({
      filter
    });
  }

  renderTab(tab) {
    switch (tab) {
    case tabs.repositories:
      return (
          <>
            <RepositoriesFilters getCurrentRepoFilter={this.getCurrentRepoFilter} />
            <RepositoriesList filter={this.state.filter} onDataChange={this.getUserData} />
          </>
      );
    case tabs.projects:
      return <div>Hello! Projects are there</div>;
    case tabs.stars:
      return <StarsTab onDataChange={this.getUserData} />;
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
      userOrgs,
      userData: {
        name,
        username,
        imgUrl,
        repositoriesCount,
        projectsCount,
        starsCount,
        followersCount,
        followingCount,
        type,
        bio,
        url: link,
        email,
        company,
        location
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
              <AdditionalUserInfo
                bio={bio}
                link={link}
                location={location}
                email={email}
                company={company}
                organizations={userOrgs}
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
