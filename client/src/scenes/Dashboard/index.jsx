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
      filter: 'All',
      repoNameFilter: ''
    };

    this.getUserData = this.getUserData.bind(this);
    this.getUsersOrgs = this.getUsersOrgs.bind(this);
    this.getCurrentRepoTypeFilter = this.getCurrentRepoTypeFilter.bind(this);
    this.handleFindRepo = this.handleFindRepo.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps) {
      return false;
    }
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.componentDidMount();
    }
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

  getCurrentRepoTypeFilter(e, { value: filter }) {
    this.setState({
      filter
    });
  }

  handleFindRepo({ target }) {
    this.setState({
      repoNameFilter: target.value
    });
  }

  renderTab(tab) {
    const {
      userData: { id: userId },
      filter,
      repoNameFilter
    } = this.state;
    switch (tab) {
    case tabs.repositories:
      return (
          <>
            <RepositoriesFilters
              filter={filter}
              getCurrentRepoTypeFilter={this.getCurrentRepoTypeFilter}
              handleFindRepo={this.handleFindRepo}
            />
            <RepositoriesList filter={filter} onDataChange={this.getUserData} repoNameFilter={repoNameFilter} />
          </>
      );
    case tabs.stars:
      return <StarsTab onDataChange={this.getUserData} />;
    default:
      return <Overview userId={userId} />;
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
        starsCount,
        type,
        bio,
        url: link,
        email,
        company,
        location,
        status
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
              <UserInfo username={username} name={name} imgUrl={imgUrl} status={status} />
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
              <DashboardHeader baseUrl={url} activeTab={tab} repoCount={repositoriesCount} starsCount={starsCount} />
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
