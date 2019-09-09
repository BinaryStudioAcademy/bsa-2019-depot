import React from 'react';
import { Container, Input, Button } from 'semantic-ui-react';
import Octicon, { Trashcan } from '@primer/octicons-react';
import InviteMembersTab from '../InviteMembersTab';
import UserPreview from '../../components/UserPreview/index';
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
    const { orgMembers, orgInfo, isOwner, handleChangeFilter } = this.props;
    const { invite } = this.state;
    return !invite ? (
      <Container className={styles.memberListContainer}>
        <div className={styles.memberListFilters}>
          <Input
            placeholder="Find a member…"
            className={styles.memberSearchInput}
            onChange={handleChangeFilter}
          ></Input>
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
              const { username, name, role } = member;
              return (
                <li key={username} className={styles.memberItem}>
                  <div className={styles.memberImg}>
                    <UserPreview size="medium" orgUser={member} />
                  </div>
                  <div className={styles.memberNameContainer}>
                    <a href={`/${username}`} className={styles.memberBox_member}>
                      {name && <span className={styles.memberName}>{name}</span>}
                      <span className={styles.memberUsername}>{username}</span>
                    </a>
                  </div>
                  <div className={styles.memberRole}>{role.toLowerCase()}</div>
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
        <InviteMembersTab orgId={orgInfo.id} />
        <Button className={styles.backBtn} onClick={this.changeInvite}>
          Go back
        </Button>
      </Container>
    );
  }
}

OrgPeopleTab.propTypes = {
  repositories: PropTypes.array,
  orgMembers: PropTypes.any,
  orgInfo: PropTypes.any,
  isOwner: PropTypes.any,
  handleChangeFilter: PropTypes.func.isRequired
};

export default OrgPeopleTab;
