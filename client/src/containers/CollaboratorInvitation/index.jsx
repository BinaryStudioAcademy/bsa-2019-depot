import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button, Icon } from 'semantic-ui-react';
import { acceptInvitation, cancelInvitation } from '../../services/inviteMemberService';

import styles from './styles.module.scss';

class CollaboratorInvitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invited: false,
      isActivated: false
    };
  }

  async componentDidMount() {
    // const { id, match } = this.props;
    // const { name } = match.params;
    // const { result } = await getRelationUserOrg(name, id);
    // const invited = Boolean(result);
    // if (invited) {
    //   const { isActivated } = result;
    //   this.setState({
    //     invited,
    //     isActivated
    //   });
    // }
  }

  acceptInvitation = async () => {
    const { id: userId, match, history } = this.props;
    const { username, reponame } = match.params;

    await acceptInvitation({
      userId,
      reponame
    });
    history.push(`/${username}/${reponame}`);
  };

  declineInvitation = async () => {
    const { id, match, history } = this.props;
    const { name } = match.params;

    await cancelInvitation({
      userId: id,
      orgName: name
    });
    history.push('/dashboard');
  };

  // goToProfileOrg = () => {
  //   const { history, match } = this.props;
  //   const { name } = match.params;
  //   history.push(`/${name}`);
  // };

  renderHaveInviteComponent = () => {
    const { username, reponame } = this.props.match.params;
    return (
      <Container textAlign="center" className={styles.form}>
        <p className={styles.title}>
          @{username} has invited you to collaborate on the{' '}
          <b>
            {username}/{reponame}
          </b>{' '}
          repository.
        </p>
        <Button type="button" positive onClick={this.acceptInvitation}>
          Join {username / reponame}
        </Button>
        <Button type="button" onClick={this.declineInvitation}>
          Decline
        </Button>
      </Container>
    );
  };

  renderNotInvitedComponent = () => {
    const { username } = this.props.match.params;
    return (
      <Container textAlign="center" className={styles.form}>
        <Icon name="warning sign" size="big" />
        <h3 className={styles.notFoundTitle}>Invitation not found</h3>
        <p className={styles.note}>We’ve looked all over but couldn’t find your invitation. </p>
        <Button inverted primary className={styles.goToBtn} onClick={this.goToUserProfile}>
          Go to {username}`s profile
        </Button>
      </Container>
    );
  };

  render() {
    const { username, reponame } = this.props.match.params;
    const { invited, isActivated } = this.state;

    if (invited && !isActivated) return this.renderHaveInviteComponent();
    if (!invited) return this.renderNotInvitedComponent();
    return <Redirect to={`/${username}/${reponame}`} />;
  }
}

CollaboratorInvitation.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  id: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({ id });

export default connect(mapStateToProps)(CollaboratorInvitation);
