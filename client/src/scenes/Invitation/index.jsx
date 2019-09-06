import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Button, Icon } from 'semantic-ui-react';
import { acceptInvitation, cancelInvitation } from '../../services/inviteMemberService';
import { getRelationUserOrg } from '../../services/orgService';

import styles from './styles.module.scss';

class Invitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invited: false,
      isActivated: false
    };
  }

  async componentDidMount() {
    const { id, match } = this.props;
    const { name } = match.params;

    const { result } = await getRelationUserOrg(name, id);

    const invited = Boolean(result);
    if (invited) {
      const { isActivated } = result;
      this.setState({
        invited,
        isActivated
      });
    }
  }

  OnClickJoin = async () => {
    const { id: userId, match, history } = this.props;
    const { name: orgName } = match.params;

    await acceptInvitation({
      userId,
      orgName
    });
    history.push(`/${orgName}`);
  };

  onClickDecline = async () => {
    const { id, match, history } = this.props;
    const { name } = match.params;

    await cancelInvitation({
      userId: id,
      orgName: name
    });
    history.push('/dashboard');
  };

  goToProfileOrg = () => {
    const { history, match } = this.props;
    const { name } = match.params;
    history.push(`/${name}`);
  };

  renderHaveInviteComponent = () => {
    const { name } = this.props.match.params;
    return (
      <Container textAlign="center" className={styles.form}>
        <p className={styles.title}>
          You’ve been invited to the <a href={`/orgs/${name}`}>{name}</a> organization!
        </p>
        <Button type="button" positive onClick={this.OnClickJoin}>
          Join {name}
        </Button>
        <Button type="button" onClick={this.onClickDecline}>
          Decline
        </Button>
      </Container>
    );
  };

  renderNotInvitedComponent = () => {
    const { name } = this.props.match.params;
    return (
      <Container textAlign="center" className={styles.form}>
        <Icon name="warning sign" size="big" />
        <h3 className={styles.notFoundTitle}>Invitation not found</h3>
        <p className={styles.note}>We’ve looked all over but couldn’t find your invitation. </p>
        <Button inverted primary className={styles.goToBtn} onClick={this.goToProfileOrg}>
          Go to {name}`s profile
        </Button>
      </Container>
    );
  };

  render() {
    const { name } = this.props.match.params;
    const { invited, isActivated } = this.state;

    if (invited && !isActivated) return this.renderHaveInviteComponent();
    if (!invited) return this.renderNotInvitedComponent();
    return <Redirect to={`/${name}`} />;
  }
}

Invitation.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  id: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({ id });

export default connect(mapStateToProps)(Invitation);
