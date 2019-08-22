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
      orgOwner: '',
      repositories: []
    };
  }

  componentDidMount() {
    const {
      userData: { id, username }
    } = this.props;

    this.getUserInfo(username).then(() => {
      this.getMembers(id);
      this.getOwner(id);
      this.getRepositories(username);
    });
  }

  async getUserInfo(username) {
    const data = await getUserDetailed(username);
    this.setState({ currentOrg: data });
  }
  async getMembers(orgId) {
    await getOrgMembers(orgId).then(data => {
      this.setState({ orgMembers: data });
    });
  }
  async getOwner(orgId) {
    await getOrgOwner(orgId).then(data => {
      this.setState({ orgOwner: data });
    });
  }
  async getRepositories(username) {
    const repositories = await getRepositories(username);
    this.setState({
      ...this.state,
      repositories
    });
  }

  render() {
    const { id } = this.props;
    const {
      repositories,
      orgMembers,
      currentOrg,
      orgOwner: { ownerId }
    } = this.state;
    return (
      <>
        <OrganizationHeader
          repoCount={repositories.length}
          memberCount={orgMembers.length}
          orgInfo={currentOrg}
          ownerId={ownerId}
          currentUserId={id}
          tab="repositories"
        />
        <Container>
          <OrgRepositoriesTab orgInfo={currentOrg} orgMembers={orgMembers} isOwner={id === ownerId} />
        </Container>
      </>
    );
  }
}

OrganizationDashboard.propTypes = {
  currentOrg: PropTypes.object,
  userData: PropTypes.object,
  id: PropTypes.string,
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
