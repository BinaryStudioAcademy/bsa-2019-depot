import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Octicon, { Person, Link as linkIco } from '@primer/octicons-react';
import { Icon, Label, Container } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

const OrganizationHeader = ({ activePage, baseUrl, repoCount, imgUrl, orgInfo }) => {
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
    <header className={styles.orgHeader}>
      <Container>
        <Container className={styles.orgInfoContainer}>
          <img src={getUserImgLink(imgUrl)} alt="organization avatar" width="100px" height="100px" />
          <Container className={styles.orgInfo}>
            <div className={styles.orgName}>{orgInfo.username}</div>
            <div className={styles.orgDescription}>{orgInfo.description ? orgInfo.description : ''}</div>
            <div className={styles.orgWebsite}>
              {orgInfo.website ? <Octicon icon={linkIco} className={styles.orgWebsiteIcon} /> : null}
              <a href={`${orgInfo.website ? orgInfo.website : ''}`}>{orgInfo.website ? orgInfo.website : ''}</a>
            </div>
          </Container>
        </Container>
        <div className={styles.orgHeaderContainer}>
          <div className="ui top attached tabular menu">
            <div className={`${activeTab === 'repositories' && 'active'} item`}>
              <Link to={baseUrl}>
                <Icon name="code" /> Repositories <Label circular>{repoCount}</Label>
              </Link>
            </div>
            <div className={`${activeTab === 'people' && 'active'} item`}>
              <Link to={`orgs${baseUrl}people`}>
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
  baseUrl: PropTypes.string,
  repoCount: PropTypes.number,
  imgUrl: PropTypes.string,
  orgInfo: PropTypes.object.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  }
}) => ({
  username
});

export default connect(mapStateToProps)(OrganizationHeader);
