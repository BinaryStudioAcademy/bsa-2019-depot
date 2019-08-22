import React from 'react';
import RepositoriesList from '../../containers/RepositoriesList';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import { Container, Grid } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class OrgRepositoriesTab extends React.Component {
  render() {
    return (
      <Container className={styles.org_repositories_list}>
        <Grid>
          <Grid.Row columns={2}>
            <Container className={styles.org_repositories_filters}>
              <RepositoriesFilters
                className={styles.org_repositories_filter}
                isOwner={this.props.isOwner}
                orgPage={true}
              />
            </Container>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={11}>
              <RepositoriesList currentOrg={this.props.orgInfo} />
            </Grid.Column>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={5}>
              <Container className={styles.memberBox}>
                <Link to={`/orgs/${this.props.orgInfo.username}/people`} className={styles.memberBox_header}>
                  <div>People</div>
                  <div>{this.props.orgMembers.length} ></div>
                </Link>
                {this.props.orgMembers.map(member => {
                  return (
                    <a href={`/${member.username}`} className={styles.memberBox_member} key={member.username}>
                      <img src={getUserImgLink(member.imgUrl)} className={styles.memberPhoto} alt="user" />
                    </a>
                  );
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
