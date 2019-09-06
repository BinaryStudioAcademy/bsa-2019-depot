import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Octicon, { Person, Link as linkIco, Mail } from '@primer/octicons-react';
import { Icon, Label, Container } from 'semantic-ui-react';
import { getOrganizationImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

const OrganizationHeader = ({
  repoCount,
  memberCount,
  imgUrl,
  orgInfo: { username, website, email, description },
  tab
}) => {
  return (
    <header className={styles.orgHeader}>
      <Container>
        <Container className={styles.orgInfoContainer}>
          <img src={getOrganizationImgLink(imgUrl)} alt="organization avatar" width="100px" height="100px" />
          <Container className={styles.orgInfo}>
            <div className={styles.orgName}>{username}</div>
            <div className={styles.orgDescription}>{description}</div>
            <div className={styles.orgWebsite}>
              {website ? <Octicon icon={linkIco} className={styles.orgWebsiteIcon} /> : null}
              <a href={`${website}`}>{website}</a>
              {email ? <Octicon icon={Mail} className={styles.orgEmail} /> : null}
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </Container>
        </Container>
        <div className={styles.orgHeaderContainer}>
          <div className="ui top attached tabular menu">
            <div className={`${tab === 'repositories' && 'active'} item`}>
              <Link to={`/${username}`}>
                <Icon name="code" /> Repositories <Label circular>{repoCount}</Label>
              </Link>
            </div>
            <div className={`${tab === 'people' && 'active'} item`}>
              <Link to={`/orgs/${username}/people`}>
                <Octicon icon={Person} className={styles.personIcon} />
                People<Label circular>{memberCount}</Label>
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
  memberCount: PropTypes.number,
  orgInfo: PropTypes.object.isRequired,
  isOwner: PropTypes.bool,
  tab: PropTypes.string
};

const mapStateToProps = ({
  profile: {
    currentUser: { username }
  }
}) => ({
  username
});

export default connect(mapStateToProps)(OrganizationHeader);
