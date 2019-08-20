import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Octicon, { Person } from '@primer/octicons-react';
import { Icon, Label, Container } from 'semantic-ui-react';

import styles from './styles.module.scss';

const OrganizationHeader = ({ activePage, baseUrl }) => {
  let activeTab;
  switch (activePage) {
  case 'repositories':
    activeTab = 'repositories';
    break;
  case 'people':
    activeTab = 'people';
    break;
  default:
    activeTab = 'repositories';
  }

  return (
    <header className={styles.repoHeader}>
      <Container>
        <div className={styles.repoHeaderContainer}>
          <div className="ui top attached tabular menu">
            <div className={`${activeTab === 'repositories' && 'active'} item`}>
              <Link to={baseUrl}>
                <Icon name="code" /> Repositories <Label circular>133</Label>
              </Link>
            </div>
            <div className={`${activeTab === 'people' && 'active'} item`}>
              <Link to={`${baseUrl}/people`}>
                <Octicon icon={Person} />
                People<Label circular>1</Label>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

OrganizationHeader.propTypes = {
  username: PropTypes.string.isRequired,
  activePage: PropTypes.string,
  baseUrl: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  }
}) => ({
  username
});

export default connect(mapStateToProps)(OrganizationHeader);
