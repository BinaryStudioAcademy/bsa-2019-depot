import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Button, Icon } from 'semantic-ui-react';
import { isInvited, acceptInvitation, cancelInvitation } from '../../services/inviteMemberService';

import styles from './styles.module.scss';

class Invitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invited: false
    };
  }

  async componentDidMount() {
    const { id } = this.props;
    const { name } = this.props.match.params;

    const { result } = await isInvited({
      userId: id,
      orgName: name
    });
    if (result) {
      this.setState({
        invited: Boolean(result)
      });
      const { isActivated } = result;
      this.setState({
        isActivated
      });
    }
  }

  OnClickJoin = async () => {
    const { id } = this.props;
    const { name } = this.props.match.params;

    await acceptInvitation({
      userId: id,
      orgName: name
    });
  };

  onClickDecline = async () => {
    const { id } = this.props;
    const { name } = this.props.match.params;

    await cancelInvitation({
      userId: id,
      orgName: name
    });
  };

  goToProfileOrg = () => {
    //const { name } = this.props.match.params;
    //history.push(`/orgs/${name}`);
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

  renderNotInviteComponent = () => {
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
    if (this.state.invited && this.state.isActivated) return <Redirect to={`/orgs/${this.props.match.params.name}`} />;
    if (!this.state.invited) return this.renderNotInviteComponent();
    if (!this.state.isActivated) return this.renderHaveInviteComponent();
  }
}

Invitation.propTypes = {
  match: PropTypes.object,
  id: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({ id });

export default connect(mapStateToProps)(Invitation);
