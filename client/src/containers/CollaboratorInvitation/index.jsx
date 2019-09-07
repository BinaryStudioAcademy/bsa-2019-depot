import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button, Loader } from 'semantic-ui-react';
import { getUserInvitationStatus, acceptInvitation, declineInvitation } from '../../services/collaboratorService';

import styles from './styles.module.scss';

class CollaboratorInvitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invited: false,
      isActivated: false,
      loading: true
    };
  }

  async componentDidMount() {
    const { userId, match } = this.props;
    const { username, reponame } = match.params;
    const [response] = await getUserInvitationStatus(username, reponame, userId);
    const invited = Boolean(response);
    if (invited) {
      const { isActivated } = response;
      this.setState({
        invited,
        isActivated,
        loading: false
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  acceptInvitation = async () => {
    const { userId, match, history } = this.props;
    const { username, reponame } = match.params;
    await acceptInvitation({ username, reponame, userId });
    history.push(`/${username}/${reponame}`);
  };

  declineInvitation = async () => {
    const { userId, match, history } = this.props;
    const { username, reponame } = match.params;
    await declineInvitation({ username, reponame, userId });
    history.push('/');
  };

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
          Join {username}/{reponame}
        </Button>
        <Button type="button" onClick={this.declineInvitation}>
          Decline
        </Button>
      </Container>
    );
  };

  render() {
    const { username, reponame } = this.props.match.params;
    const { invited, isActivated, loading } = this.state;
    if (loading) return <Loader active />;
    if (invited && !isActivated) return this.renderHaveInviteComponent();
    return <Redirect to={`/${username}/${reponame}`} />;
  }
}

CollaboratorInvitation.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  userId: PropTypes.string.isRequired,
  ownUsername: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId, username: ownUsername }
  }
}) => ({ userId, ownUsername });

export default connect(mapStateToProps)(CollaboratorInvitation);
