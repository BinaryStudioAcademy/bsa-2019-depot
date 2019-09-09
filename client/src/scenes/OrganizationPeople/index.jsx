import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import OrganizationHeader from '../../components/OrganizationHeader';
import OrgPeopleTab from '../../containers/OrgPeopleTab';
import { getRepositories } from '../../services/repositoryService';
import { getUserDetailed } from '../../services/userService';
import { getOrgMembers, getOrgOwner } from '../../services/orgService';

class OrganizationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrg: {},
      orgMembers: [],
      repositories: [],
      filter: ''
    };
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
  }

  async componentDidMount() {
    const {
      match: {
        params: { name }
      }
    } = this.props;

    await this.getUserInfo(name);

    const {
      currentOrg: { id }
    } = this.state;

    await this.getMembers(id);
    await this.isOwner(id);
    await this.getRepositories(name);
  }

  async getUserInfo(name) {
    const data = await getUserDetailed(name);
    this.setState({ currentOrg: data });
  }
  async getMembers(orgId) {
    await getOrgMembers(orgId).then(data => {
      this.setState({ orgMembers: data });
    });
  }

  async isOwner(orgId) {
    const { username } = this.props;
    const owners = await getOrgOwner(orgId);
    const usernames = owners.map(({ username }) => username);
    this.setState({ isOwner: usernames.includes(username) });
  }

  async getRepositories(username) {
    const repositories = await getRepositories(username);
    this.setState({
      ...this.state,
      repositories
    });
  }

  handleChangeFilter(e) {
    this.setState({ filter: e.target.value.toLowerCase() });
  }

  filterMembers(members) {
    const { filter } = this.state;
    return members.filter(({ username }) => username.toLowerCase().includes(filter));
  }

  render() {
    const { repositories, orgMembers, currentOrg, isOwner } = this.state;
    const filteredOrgMembers = this.filterMembers(orgMembers);
    return (
      <>
        <OrganizationHeader
          repoCount={repositories.length}
          memberCount={orgMembers.length}
          orgInfo={currentOrg}
          tab="people"
        />
        <Container>
          <OrgPeopleTab
            orgMembers={filteredOrgMembers}
            orgInfo={currentOrg}
            isOwner={isOwner}
            handleChangeFilter={this.handleChangeFilter}
          />
        </Container>
      </>
    );
  }
}

OrganizationDashboard.propTypes = {
  currentOrg: PropTypes.object,
  id: PropTypes.string,
  username: PropTypes.string,
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

const mapStateToProps = ({ profile: { currentUser } }) => ({
  name: currentUser.name,
  username: currentUser.username,
  id: currentUser.id,
  imgUrl: currentUser.imgUrl
});

export default connect(mapStateToProps)(withRouter(OrganizationDashboard));
