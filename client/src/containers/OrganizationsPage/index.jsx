import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Button, Header } from 'semantic-ui-react';
import { getUsersOrganizations } from '../../services/userService';
import UserPreview from '../../components/UserPreview/index';

import styles from './styles.module.scss';

class OrganizationsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userOrgs: []
    };
  }

  async getUsersOrgs(id) {
    const userOrgs = await getUsersOrganizations(id);
    this.setState({
      ...this.state,
      userOrgs
    });
  }

  async componentDidMount() {
    const { id } = this.props;
    await this.getUsersOrgs(id);
  }

  render() {
    const { userOrgs } = this.state;
    return (
      <Container>
        <Header as="h2" dividing className={styles.headerWrapper}>
          <Header.Content>Organizations</Header.Content>
          <Link to="/organizations/new">
            <Button color="blue" compact>
              New organization
            </Button>
          </Link>
        </Header>
        <ul className={styles.orgList}>
          {userOrgs.map(organization => {
            const { username } = organization;
            return (
              <li key={username} className={styles.orgItem}>
                <div className={styles.orgInfo}>
                  <UserPreview size="micro" orgUser={organization} />
                  <a href={`/${username}`} className={styles.orgName}>
                    {username}
                  </a>
                  <span>owner</span>
                </div>
                <Button color="blue" compact>
                  Leave
                </Button>
              </li>
            );
          })}
        </ul>
      </Container>
    );
  }
}

OrganizationsPage.propTypes = {
  id: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id }
  }
}) => ({ id });

export default connect(mapStateToProps)(OrganizationsPage);
