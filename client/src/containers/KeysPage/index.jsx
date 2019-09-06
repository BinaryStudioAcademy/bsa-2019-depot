import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Header, Icon, Label, Loader, Modal } from 'semantic-ui-react';
import DeleteKeyButton from '../../components/DeleteKeyButton';
import { getKeys, deleteKey } from '../../services/userService';

import styles from './styles.module.scss';

class KeysPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: [],
      loading: true,
      deleting: false,
      showDeleteModal: false,
      deletingKeyId: ''
    };

    this.handleNewKey = this.handleNewKey.bind(this);
    this.handleRequestDeleteKey = this.handleRequestDeleteKey.bind(this);
    this.handleDeleteKey = this.handleDeleteKey.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }

  componentDidMount() {
    this.getUserKeys();
  }

  getUserKeys() {
    const { userId } = this.props;
    getKeys(userId).then(keys => {
      this.setState({ keys, loading: false });
    });
  }

  toggleDeleteModal() {
    this.setState(prevState => ({ showDeleteModal: !prevState.showDeleteModal }));
  }

  handleNewKey() {
    this.props.history.push('/settings/keys/new');
  }

  handleRequestDeleteKey(id) {
    this.setState({ deletingKeyId: id });
    this.toggleDeleteModal();
  }

  handleDeleteKey() {
    this.setState({ deleting: true });
    deleteKey(this.state.deletingKeyId).then(() => {
      this.setState({ loading: true, deleting: false });
      this.toggleDeleteModal();
      this.getUserKeys();
    });
  }

  render() {
    const { loading, deleting, showDeleteModal, keys } = this.state;

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
              <Button negative basic fluid loading={deleting} onClick={this.handleDeleteKey}>
                I understand, please delete this SSH key
              </Button>
            </Modal.Actions>
          </Modal>
        )}
        <Header as="h2" dividing>
          <Header.Content>SSH keys</Header.Content>
          <Button color="blue" size="small" onClick={this.handleNewKey} compact>
            New SSH key
          </Button>
        </Header>
        <div className={styles.sectionText}>
          <p>This is a list of SSH keys associated with your account. Remove any keys that you do not recognize.</p>
          {loading ? (
            <Loader active />
          ) : (
            <ul className={styles.keyList}>
              {keys.map(({ id, title, fingerprint, createdAt }) => (
                <li key={id} className={styles.keyListItem}>
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
                  <DeleteKeyButton keyId={id} onClick={this.handleRequestDeleteKey} />
                </li>
              ))}
            </ul>
          )}
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
  history: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId }
  }
}) => ({
  userId
});

export default connect(mapStateToProps)(KeysPage);
