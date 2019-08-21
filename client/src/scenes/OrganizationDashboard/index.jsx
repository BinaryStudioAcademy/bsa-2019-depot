import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { repositoryActions } from '../Dashboard/actions';
import OrganizationHeader from '../../components/OrganizationHeader';
import OrgRepositoriesTab from '../../containers/OrgRepositoriesTab';
import OrgPeopleTab from '../../containers/OrgPeopleTab';

import { getUser } from '../../services/userService';
import { getOrgMembers, getOrgOwner } from '../../services/orgService';

class OrganizationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrg: {},
      orgMembers: [],
      orgOwner: ''
    };
    this.renderRepoView = this.renderRepoView.bind(this);
    this.renderPeopleView = this.renderPeopleView.bind(this);
  }

  componentDidMount() {
    const { actions, match } = this.props;
    const userToRender = match.params.username;
    actions.fetchRepositories({
      userToRender
    });

    this.getUserInfo(userToRender).then(() => {
      this.getMembers(this.state.currentOrg.id);
      this.getOwner(this.state.currentOrg.id);
    });
  }

  renderRepoView() {
    return (
      <OrgRepositoriesTab
        repositories={this.props.repositories}
        orgInfo={this.props.currentOrg}
        orgMembers={this.state.orgMembers}
        isOwner={this.props.id === this.state.orgOwner.ownerId}
      />
    );
  }

  renderPeopleView() {
    return (
      <OrgPeopleTab
        orgMembers={this.state.orgMembers}
        orgInfo={this.state.currentOrg}
        ownerId={this.state.orgOwner.ownerId}
        isOwner={this.props.id === this.state.orgOwner.ownerId}
      />
    );
  }

  async getUserInfo(userToRender) {
    const data = await getUser({ userToRender });
    this.setState({ currentOrg: data });
  }

  async getMembers(orgId) {
    const data = await getOrgMembers(orgId);
    this.setState({ orgMembers: data });
  }

  async getOwner(orgId) {
    const data = await getOrgOwner(orgId);
    this.setState({ orgOwner: data });
  }

  render() {
    const { repositories, currentOrg, match, id } = this.props;
    return (
      <>
        <OrganizationHeader
          repoCount={repositories.length}
          memberCount={this.state.orgMembers.length}
          orgInfo={currentOrg}
          baseUrl={match.url}
          ownerId={this.state.orgOwner.ownerId}
          currentUserId={id}
        />
        <Container>
          <Switch>
            <Route exact path={`${match.path}`} render={this.renderRepoView} />
            <Route exact path={`/orgs/${match.path}/people`} render={this.renderPeopleView} />
          </Switch>
        </Container>
      </>
    );
  }
}

OrganizationDashboard.propTypes = {
  actions: PropTypes.object.isRequired,
  currentOrg: PropTypes.object,
  id: PropTypes.string,
  repositories: PropTypes.array.isRequired,
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

const mapStateToProps = ({ userStats: { repositories }, profile: { currentUser } }) => ({
  name: currentUser.name,
  username: currentUser.username,
  id: currentUser.id,
  imgUrl: currentUser.imgUrl,
  repositories
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...repositoryActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrganizationDashboard));
