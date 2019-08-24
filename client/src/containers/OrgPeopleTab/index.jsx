import React from 'react';
import { Container, Input, Button } from 'semantic-ui-react';
import Octicon, { Trashcan } from '@primer/octicons-react';
import UserPreview from '../../components/UserPreview/index';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class OrgPeopleTab extends React.Component {
  render() {
    const { orgMembers, orgInfo, ownerId, isOwner } = this.props;
    return (
      <Container className={styles.memberListContainer}>
        <div className={styles.memberListFilters}>
          <Input placeholder="Find a member…" className={styles.memberSearchInput}></Input>
          {isOwner && <Button className={styles.inviteButton}>Invite Member</Button>}
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
                    <UserPreview size="medium" orgUser={member} />
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
