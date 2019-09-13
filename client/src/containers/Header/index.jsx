/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Menu, Sidebar, Icon, Dropdown, Responsive, Search } from 'semantic-ui-react';
import Octicon, { Repo, Smiley, Person, Organization } from '@primer/octicons-react';
import StatusModal from '../../components/StatusModal';
import { fetchCurrentUser } from '../../routines/routines';
import { getUserImgLink } from '../../helpers/imageHelper';
import * as searchService from '../../services/searchService';
import styles from './styles.module.scss';
import { ReactComponent as LogoSVG } from '../../styles/assets/icons/logo_icon_bright.svg';
import { ReactComponent as BurgerSVG } from '../../styles/assets/icons/burger.svg';

const signOut = () => {
  const { localStorage, location } = window;
  localStorage.clear();
  location.reload();
};

const SearchInp = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [timeout, changeTimeout] = useState(null);

  const getIcon = type => {
    switch (type.toLowerCase()) {
    case 'repo':
      return Repo;
    case 'user':
      return Person;
    case 'org':
      return Organization;
    default:
      return null;
    }
  };

  const resultRenderer = ({ content }) => {
    const [type, username, reponame] = content;
    const endpoint = type === 'REPO' ? `/${username}/${reponame}` : `/${username}`;
    const icon = getIcon(type);
    return (
      <div
        onClick={() => {
          setText('');
          setResults([]);
          window.location.href = `${window.location.origin}${endpoint}`;
        }}
      >
        <p className={styles.searchItem}>
          <Octicon className={styles.searchItemIcon} icon={icon} />
          {endpoint}
        </p>
      </div>
    );
  };

  const handleSearchChange = async (e, { value }) => {
    if (!value) {
      setResults([]);
      return setText('');
    }
    setLoading(true);
    setText(value);
    if (timeout) {
      clearTimeout(timeout);
      changeTimeout(null);
    }
    const [user, repo] = value.split('/');
    changeTimeout(
      setTimeout(async () => {
        const results = (await searchService.find(user, repo)).map(({ type, username, reponame }) => ({
          content: [type, username, reponame]
        }));
        setResults(results);
        setLoading(false);
      }, 300)
    );
  };

  return (
    <Search
      className={styles.searchInput}
      input={{ icon: 'search' }}
      placeholder="Search Depot"
      onSearchChange={handleSearchChange}
      loading={isLoading}
      results={results}
      value={text}
      resultRenderer={resultRenderer}
    />
  );
};

const signIn = <a href="/login">Sign in</a>;
const signUp = <a href="/registration">Sign up</a>;
const logo = (
  <a className={styles.logo} href="/">
    <LogoSVG width={32} height={32} />
  </a>
);

const SidebarUnauth = (closeSidebar, sidebarOpened) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      onHide={closeSidebar}
      vertical
      visible={sidebarOpened}
      width="wide"
      direction="right"
      className={styles.sidebar}
    >
      <Menu.Item onClick={closeSidebar} as="a">
        <Icon name="close" color="grey" />
      </Menu.Item>
      <Menu.Item className={styles.sidebarForm} as="div">
        <div>
          {signIn}
          {signUp}
        </div>
      </Menu.Item>
    </Sidebar>
  );
};

const MenuDesktop = () => (
  <ul>
    <li>{logo}</li>
  </ul>
);

// HOC
const WithSidebar = (Comp, options) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  function closeSidebar() {
    setSidebarOpened(false);
  }
  function openSidebar() {
    setSidebarOpened(true);
  }

  return <Comp sidebarOpened={sidebarOpened} closeSidebar={closeSidebar} openSidebar={openSidebar} options={options} />;
};

const HeaderDesktopUnauth = ({ openSidebar, closeSidebar, sidebarOpened }) => (
  <div className={styles.headerWrp}>
    <Grid centered container>
      <Grid.Row>
        <Grid.Column computer={10} tablet={8} mobile={6}>
          {MenuDesktop()}
        </Grid.Column>
        <Grid.Column computer={6} tablet={8} mobile={10}>
          <div className={styles.form}>
            {signIn}
            {signUp}
            <BurgerSVG className={styles.burger} onClick={openSidebar} />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>

    {SidebarUnauth(closeSidebar, sidebarOpened)}
  </div>
);

HeaderDesktopUnauth.propTypes = {
  openSidebar: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool.isRequired
};

const pullRequests = username => <a href={`/${username}/pull-requests`}>Pull requests</a>;
const issues = username => <a href={`/${username}/issues`}>Issues</a>;

const SidebarAuth = (closeSidebar, sidebarOpened, userName, imgUrl) => (
  <Sidebar
    as={Menu}
    animation="overlay"
    icon="labeled"
    inverted
    onHide={closeSidebar}
    vertical
    visible={sidebarOpened}
    width="wide"
    direction="top"
    className={styles.sidebar}
  >
    <Menu.Item onClick={closeSidebar} as="a">
      <Icon name="close" />
    </Menu.Item>
    <Menu.Item as="div">{SearchInp()}</Menu.Item>
    <Menu.Item as="div">
      <a href="/">Dashboard</a>
    </Menu.Item>
    <Menu.Item as="div">{pullRequests(userName)}</Menu.Item>
    <Menu.Item as="div">{issues(userName)}</Menu.Item>
    <Menu.Item as="div">
      <a href={`/${userName}`}>
        {<img src={getUserImgLink(imgUrl)} alt="user" />}
        {userName}
      </a>
    </Menu.Item>
    <Menu.Item as="div" onClick={signOut}>
      <a href="/">
        <Icon name="sign out" />
        Sign Out
      </a>
    </Menu.Item>
  </Sidebar>
);

const HeaderDesktopAuth = ({
  openSidebar,
  closeSidebar,
  sidebarOpened,
  options: { username, imgUrl, status, fetchCurrentUser }
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  function showModal() {
    setShowStatusModal(true);
  }

  function hideModal() {
    setShowStatusModal(false);
    fetchCurrentUser();
  }

  return (
    <div className={styles.headerWrpAuth}>
      <Grid>
        <Grid.Column computer={7} tablet={6} mobile={6} floated="left">
          <Responsive minWidth={1200}>
            <ul>
              <li>{logo}</li>
              <li>{SearchInp()}</li>
              <li>{pullRequests(username)}</li>
              <li>{issues(username)}</li>
            </ul>
          </Responsive>
          <Responsive maxWidth={1200}>
            <BurgerSVG className={styles.burger} onClick={openSidebar} />
          </Responsive>
        </Grid.Column>

        <Grid.Column computer={2} tablet={4} mobile={4}>
          <Responsive maxWidth={1200}>{logo}</Responsive>
        </Grid.Column>
        <Grid.Column computer={7} tablet={6} mobile={6} floated="right">
          <ul className={styles.rightMenu}>
            <li>
              <Dropdown
                pointing="top right"
                icon={null}
                trigger={
                  <div>
                    <Icon name="plus" />
                    <Icon name="dropdown" />
                  </div>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item href="/new">New repository</Dropdown.Item>
                  <Dropdown.Item href="/organizations/new">New organization</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li>
              <Dropdown
                pointing="top right"
                icon={null}
                trigger={
                  <div>
                    {<img src={getUserImgLink(imgUrl)} alt="user" />}
                    <Icon name="dropdown" />
                  </div>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item>
                    Signed in as <b>{username}</b>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={showModal}>
                    <div className={styles.statusItem}>
                      <Octicon icon={Smiley} />
                      {status || 'Set Status'}
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href={`/${username}`}>Your profile</Dropdown.Item>
                  <Dropdown.Item href={`/${username}?tab=repositories`}>Your repositories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/settings/profile">Settings</Dropdown.Item>
                  <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </Grid.Column>
      </Grid>

      {SidebarAuth(closeSidebar, sidebarOpened, username, imgUrl)}
      <StatusModal showStatusModal={showStatusModal} hideModal={hideModal} username={username} />
    </div>
  );
};

HeaderDesktopAuth.propTypes = {
  openSidebar: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
  options: PropTypes.exact({
    username: PropTypes.string,
    imgUrl: PropTypes.string,
    status: PropTypes.string,
    fetchCurrentUser: PropTypes.func
  })
};

SearchInp.propTypes = {
  content: PropTypes.array.isRequired
};

const Header = ({ isAuthorized, username, imgUrl, status, fetchCurrentUser }) => {
  return isAuthorized
    ? WithSidebar(HeaderDesktopAuth, { username, imgUrl, status, fetchCurrentUser })
    : WithSidebar(HeaderDesktopUnauth);
};

const mapStateToProps = ({
  profile: {
    isAuthorized,
    currentUser: { username, imgUrl, status }
  }
}) => ({
  isAuthorized,
  username,
  imgUrl,
  status
});

const mapDispatchToProps = {
  fetchCurrentUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
