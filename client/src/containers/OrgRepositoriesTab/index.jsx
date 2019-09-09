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
      isMember,
      orgInfo: { username },
      filter,
      repoNameFilter,
      handleFindRepo,
      getCurrentRepoTypeFilter
    } = this.props;
    return (
      <Container className={styles.org_repositories_list}>
        <Grid>
          <Grid.Row columns={2}>
            <Container className={styles.org_repositories_filters}>
              <RepositoriesFilters
                className={styles.org_repositories_filter}
                isOwner={isOwner}
                isMember={isMember}
                orgPage={true}
                orgName={username}
                filter={filter}
                getCurrentRepoTypeFilter={getCurrentRepoTypeFilter}
                handleFindRepo={handleFindRepo}
              />
            </Container>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={11}>
              <RepositoriesList currentOrg={orgInfo} filter={filter} repoNameFilter={repoNameFilter} />
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
  isOwner: PropTypes.any,
  isMember: PropTypes.bool,
  repositories: PropTypes.array,
  filter: PropTypes.string,
  repoNameFilter: PropTypes.string,
  getCurrentRepoTypeFilter: PropTypes.func,
  handleFindRepo: PropTypes.func
};

export default OrgRepositoriesTab;
