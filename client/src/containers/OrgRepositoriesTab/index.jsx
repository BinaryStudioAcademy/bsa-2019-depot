import React from 'react';
import RepositoriesList from '../../containers/RepositoriesList';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import UserPreview from '../../components/UserPreview/index';
import { Container, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class OrgRepositoriesTab extends React.Component {
  render() {
    const {
      orgMembers,
      orgInfo,
      isOwner,
      orgInfo: { username }
    } = this.props;
    return (
      <Container className={styles.org_repositories_list}>
        <Grid>
          <Grid.Row columns={2}>
            <Container className={styles.org_repositories_filters}>
              <RepositoriesFilters
                className={styles.org_repositories_filter}
                isOwner={isOwner}
                orgPage={true}
                orgName={username}
              />
            </Container>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={11}>
              <RepositoriesList currentOrg={orgInfo} />
            </Grid.Column>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={5}>
              <Container className={styles.memberBox}>
                <Link to={`/orgs/${orgInfo.username}/people`} className={styles.memberBox_header}>
                  <div>People</div>
                  <div>{orgMembers.length} ></div>
                </Link>
                {orgMembers.map(member => {
                  return <UserPreview size="medium" orgUser={member} key={member.username} />;
                })}
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

OrgRepositoriesTab.propTypes = {
  orgMembers: PropTypes.any,
  orgInfo: PropTypes.any,
  ownerId: PropTypes.any,
  isOwner: PropTypes.any,
  repositories: PropTypes.array
};

export default OrgRepositoriesTab;
