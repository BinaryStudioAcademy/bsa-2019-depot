import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { repositoryActions } from '../Dashboard/actions';
import OrganizationHeader from '../../components/OrganizationHeader';
import OrgRepositoriesTab from '../../containers/OrgRepositoriesTab';

import { getUser } from '../../services/userService';

class OrganizationDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {}
    };
  }

  componentDidMount() {
    const { actions, match } = this.props;
    const userToRender = match.params.username;
    actions.fetchRepositories({
      limit: '',
      filterWord: '',
      userToRender
    });

    this.getUserInfo(userToRender);
  }

  async getUserInfo(userToRender) {
    const data = await getUser({ userToRender });
    this.setState({ currentUser: data });
  }
  render() {
    const { repositoriesNames } = this.props;
    return (
      <>
        <OrganizationHeader repoCount={repositoriesNames.length} orgInfo={this.state.currentUser} />
        <Container>
          <OrgRepositoriesTab repositories={repositoriesNames} />
        </Container>
      </>
    );
  }
}

OrganizationDashboard.propTypes = {
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

const mapStateToProps = ({ userStats: { repositoriesNames }, profile: { currentUser } }) => ({
  name: currentUser.name,
  username: currentUser.username,
  imgUrl: currentUser.imgUrl,
  repositoriesNames
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
