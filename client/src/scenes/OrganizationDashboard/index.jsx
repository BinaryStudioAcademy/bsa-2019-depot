import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import OrganizationHeader from '../../components/OrganizationHeader';
import OrgRepositoriesTab from '../../containers/OrgRepositoriesTab';
import { getRepositories } from '../../services/repositoryService';
import { getUserDetailed } from '../../services/userService';
import { getOrgMembers, getOrgOwner } from '../../services/orgService';

class OrganizationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrg: {},
      orgMembers: [],
      isOwner: false,
      repositories: [],
      filter: 'All'
    };
  }

  componentDidMount() {
    const {
      userData: { id, username }
    } = this.props;

    this.getUserInfo(username).then(() => {
      this.getMembers(id);
      this.isOwner(id);
      this.getRepositories(username);
    });
  }

  async getUserInfo(username) {
    const data = await getUserDetailed(username);
    this.setState({ currentOrg: data });
  }
  async getMembers(orgId) {
    const { username } = this.props;
    await getOrgMembers(orgId).then(data => {
      this.setState({ orgMembers: data, isMember: data.some(member => member.username === username) });
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

  render() {
    const { repositories, orgMembers, currentOrg, isOwner, isMember, filter } = this.state;
    return (
      <>
        <OrganizationHeader
          repoCount={repositories.length}
          memberCount={orgMembers.length}
          orgInfo={currentOrg}
          tab="repositories"
        />
        <Container>
          <OrgRepositoriesTab
            orgInfo={currentOrg}
            orgMembers={orgMembers}
            isOwner={isOwner}
            isMember={isMember}
            filter={filter}
          />
        </Container>
      </>
    );
  }
}

OrganizationDashboard.propTypes = {
  currentOrg: PropTypes.object,
  userData: PropTypes.object,
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
