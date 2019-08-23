import React from 'react';
import { Container, Input, Button } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import Octicon, { Trashcan } from '@primer/octicons-react';
import InviteMembersTab from '../InviteMembersTab';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class OrgPeopleTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invite: false
    };
  }

  changeInvite = () => {
    const { invite } = this.state;
    this.setState({
      invite: !invite
    });
  };

  render() {
    const { orgMembers, orgInfo, ownerId, isOwner } = this.props;
    const { invite } = this.state;
    return !invite ? (
      <Container className={styles.memberListContainer}>
        <div className={styles.memberListFilters}>
          <Input placeholder="Find a member…" className={styles.memberSearchInput}></Input>
          {isOwner && (
            <Button onClick={this.changeInvite} className={styles.inviteButton}>
              Invite Member
            </Button>
          )}
        </div>
        <div className={styles.memberListHeader}>
          <span className={styles.headerInfo}>
            {orgMembers.length} people in the {orgInfo.username} organization
          </span>
        </div>
        <div className={styles.memberListContainer}>
          <ul>
            {orgMembers.map(member => {
              return (
                <li key={member.username} className={styles.memberItem}>
                  <div className={styles.memberImg}>
                    <a href={`/${member.username}`} className={styles.memberBox_member}>
                      <img src={getUserImgLink(member.imgUrl)} className={styles.memberPhoto} alt="userPicture" />
                    </a>
                  </div>
                  <div className={styles.memberNameContainer}>
                    <a href={`/${member.username}`} className={styles.memberBox_member}>
                      {member.name && <span className={styles.memberName}>{member.name}</span>}
                      <span className={styles.memberUsername}>{member.username}</span>
                    </a>
                  </div>
                  <div className={styles.memberRole}>{member.id === ownerId ? 'Owner' : 'Member'}</div>
                  {isOwner && (
                    <div className={styles.deleteUser}>
                      <Octicon icon={Trashcan} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    ) : (
      <Container className={styles.memberListContainer} textAlign="center">
        <InviteMembersTab />
        <Button className={styles.backBtn} onClick={this.changeInvite}>
          Go Back
        </Button>
      </Container>
    );
  }
}

OrgPeopleTab.propTypes = {
  repositories: PropTypes.array,
  orgMembers: PropTypes.any,
  orgInfo: PropTypes.any,
  ownerId: PropTypes.any,
  isOwner: PropTypes.any
};

export default OrgPeopleTab;
