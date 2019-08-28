import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PrivateRoute from '../PrivateRoute';
// import RepositoryOptions from '../RepositoryOptions';
import CollaboratorsPage from '../CollaboratorsPage';
import styles from './styles.module.scss';

class RepoSettings extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Grid container stackable className={styles.box}>
        <Grid.Column width={4} className={styles.first_column}>
          <Menu vertical>
            <Menu.Item>
              <Link to={`${match.url}`}>Options</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`${match.url}/collaborators`}>Collaborators</Link>
            </Menu.Item>
          </Menu>
        </Grid.Column>
        <Grid.Column width={12} className={styles.second_column}>
          <Switch>
            {/* <PrivateRoute path={`${match.path}`} component={RepositoryOptions} /> */}
            <PrivateRoute path={`${match.path}`} component={CollaboratorsPage} />
          </Switch>
        </Grid.Column>
      </Grid>
    );
  }
}

RepoSettings.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default RepoSettings;
