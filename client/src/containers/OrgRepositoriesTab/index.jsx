import React from 'react';
import RepositoriesList from '../../components/RepositoriesList';
import RepositoriesFilters from '../../components/RepositoriesFilters';
import { Container, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class OrgRepositoriesTab extends React.Component {
  render() {
    return (
      <Container className={styles.org_repositories_list}>
        <Grid>
          <Grid.Row columns={2}>
            <Container className={styles.org_repositories_filters}>
              <RepositoriesFilters className={styles.org_repositories_filter} />
            </Container>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={11}>
              <RepositoriesList repositories={this.props.repositories} />
            </Grid.Column>
            <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={8} computer={5}>
              <div>Test</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

OrgRepositoriesTab.propTypes = {
  repositories: PropTypes.array
};

export default OrgRepositoriesTab;
