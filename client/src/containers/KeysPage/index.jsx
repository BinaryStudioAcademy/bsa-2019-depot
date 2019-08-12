import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Header, Icon, Label, Modal } from 'semantic-ui-react';

import styles from './styles.module.scss';

class KeysPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteModal: false
    };

    this.handleNewKey = this.handleNewKey.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }

  getDaysDiff(dateA, dateB) {
    const a = moment(dateA);
    const b = moment(dateB);
    return Math.abs(a.diff(b, 'days'));
  }

  toggleDeleteModal() {
    this.setState(prevState => ({ showDeleteModal: !prevState.showDeleteModal }));
  }

  handleNewKey() {
    this.props.history.push('/settings/keys/new');
  }

  render() {
    // const { keys } = this.props;
    const { showDeleteModal } = this.state;

    // Mocks
    const keys = [
      {
        title: 'work-windows',
        fingerprint: '32:d8:79:39:1c:96:3d:93:5a:4c:53:bd:e9:ca:12:e0',
        createdAt: new Date('December 17, 2018 03:24:00')
      },
      {
        title: 'home-ubuntu',
        fingerprint: '32:d8:79:12:1c:96:3d:93:43:4c:53:bd:e2:ca:12:e0',
        createdAt: new Date('December 17, 2018 03:24:00')
      }
    ];

    return (
      <>
        {showDeleteModal && (
          <Modal size="tiny" open={showDeleteModal} onClose={this.toggleDeleteModal}>
            <Modal.Header>Are you sure you want to delete this SSH key?</Modal.Header>
            <Modal.Content>
              <p>
                This action CANNOT be undone. This will permanently delete the SSH key and if you’d like to use it in
                the future, you will need to upload it again.
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button negative basic fluid>
                I understand, please delete this SSH key
              </Button>
            </Modal.Actions>
          </Modal>
        )}
        <Header as="h2" dividing>
          <Header.Content>SSH keys</Header.Content>
          <Button color="green" size="small" onClick={this.handleNewKey} compact>
            New SSH key
          </Button>
        </Header>
        <div className={styles.section}>
          <p>This is a list of SSH keys associated with your account. Remove any keys that you do not recognize.</p>
          <ul className={styles.keyList}>
            {keys.map(({ title, fingerprint, createdAt }, index) => (
              <li key={index} className={styles.keyListItem}>
                <div className={styles.infoSection}>
                  <div className={styles.keyIcon}>
                    <Icon color="black" size="big" name="key" />
                    <Label>SSH</Label>
                  </div>
                  <div className={styles.keyInfo}>
                    <div className={styles.keyTitle}>{title}</div>
                    <div className={styles.keyDescription}>
                      <div className={styles.fingerprint}>
                        <code>{fingerprint}</code>
                      </div>
                      <div>Added on {moment(createdAt).format('MMM D, YYYY')}</div>
                    </div>
                  </div>
                </div>
                <Button basic color="red" compact onClick={this.toggleDeleteModal}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
          <p>
            Check out our guide to
            <a href="https://help.github.com/en/articles/connecting-to-github-with-ssh"> generating SSH keys </a>
            or troubleshoot
            <a href="https://help.github.com/ssh-issues/"> common SSH Problems</a>.
          </p>
        </div>
      </>
    );
  }
}

KeysPage.propTypes = {
  keys: PropTypes.array, // TODO: Define in details
  history: PropTypes.object.isRequired
};

export default KeysPage;
