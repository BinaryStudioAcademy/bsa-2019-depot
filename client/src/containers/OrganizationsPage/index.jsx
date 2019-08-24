import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Button, Header } from 'semantic-ui-react';
import { getUsersOrganizations } from '../../services/userService';

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
