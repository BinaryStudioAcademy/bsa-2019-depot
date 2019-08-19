import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Icon } from 'semantic-ui-react';

import styles from './styles.module.scss';

class Invitation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invited: false
    };
  }

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
        <Button type="button" positive>
          Join {name}
        </Button>
        <Button type="button">Decline</Button>
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
    return this.state.invited ? this.renderHaveInviteComponent() : this.renderNotInviteComponent();
  }
}

Invitation.propTypes = {
  match: PropTypes.object
};

export default Invitation;
