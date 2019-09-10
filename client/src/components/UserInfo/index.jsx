import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import StatusModal from '../StatusModal';
import { fetchCurrentUser } from '../../routines/routines';
import { getUserImgLink } from '../../helpers/imageHelper';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const UserInfo = ({ imgUrl, name, username, status, currentUsername, fetchCurrentUser }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  function showModal() {
    setShowStatusModal(true);
  }
  function hideModal() {
    setShowStatusModal(false);
    fetchCurrentUser();
  }

  const isMyInfo = currentUsername === username;
  return (
    <div className={styles.userInfo}>
      <div className={styles.avatar_wrapper}>
        <Link to="">
          <img src={getUserImgLink(imgUrl)} alt="user_avatar" />
        </Link>
      </div>
      <div className={styles.userDetails}>
        {!isMyInfo && !status ? null : (
          <div className={styles.set_status} onClick={isMyInfo ? showModal : null}>
            <Octicon icon={Smiley} />
            {status || 'Set status'}
          </div>
        )}
        <div className={styles.namesContainer}>
          <h1>
            <span className={styles.fullname}>{name ? <span className={styles.name}>{name}</span> : null}</span>
            {username}
          </h1>
        </div>
        {isMyInfo && (
          <Link to="/settings/profile" className={styles.edit_profile}>
            <Button fluid className={styles.editButton}>
              Edit profile
            </Button>
          </Link>
        )}
      </div>
      <StatusModal showStatusModal={showStatusModal} hideModal={hideModal} username={username} />
    </div>
  );
};

UserInfo.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string,
  imgUrl: PropTypes.string,
  status: PropTypes.string,
  currentUsername: PropTypes.string,
  fetchCurrentUser: PropTypes.func
};

const mapStateToProps = ({
  profile: {
    currentUser: { username: currentUsername }
  }
}) => ({
  currentUsername
});

const mapDispatchToProps = {
  fetchCurrentUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo);
