import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Menu, Sidebar, Icon, Dropdown, Responsive, Modal, Form, Button } from 'semantic-ui-react';
import Octicon, { Smiley } from '@primer/octicons-react';
import { getUserImgLink } from '../../helpers/imageHelper';

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
  function onTextChange({ target }) {
    setText(target.value);
  }

  return <input placeholder="Search Depot" onChange={onTextChange} value={text} type="text" />;
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
        {SearchInp()}
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
            {SearchInp()}
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

const pullRequests = <a href="/">Pull requests</a>;
const issues = username => <a href={`/${username}/issues`}>Issues</a>;

const SidebarAuth = (closeSidebar, sidebarOpened, userName, avatar) => (
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
    <Menu.Item as="div">{pullRequests}</Menu.Item>
    <Menu.Item as="div">{issues(userName)}</Menu.Item>
    <Menu.Item as="div">
      <a href={`/${userName}`}>
        {<img src={getUserImgLink(avatar)} alt="user" />}
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

const StatusModal = (showStatusModal, hideModal) => {
  return (
    <Modal open={showStatusModal} onClose={hideModal} size="tiny">
      <Modal.Header>Edit status</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field control="input" placeholder="What's happening?" />
          <div className={styles.statusFormButtons}>
            <Button type="submit" color="blue" fluid>
              Set status
            </Button>
            <Button basic fluid>
              Clear status
            </Button>
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const HeaderDesktopAuth = ({ openSidebar, closeSidebar, sidebarOpened, options: { username, avatar } }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  function showModal() {
    setShowStatusModal(true);
  }
  function hideModal() {
    setShowStatusModal(false);
  }

  return (
    <div className={styles.headerWrpAuth}>
      <Grid>
        <Grid.Column computer={7} tablet={6} mobile={6} floated="left">
          <Responsive minWidth={1200}>
            <ul>
              <li>{logo}</li>
              <li>{SearchInp()}</li>
              <li>{pullRequests}</li>
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
              <a href="/">
                <Icon name="bell" />
              </a>
            </li>
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
                  <Dropdown.Item>Import repository</Dropdown.Item>
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
                    {<img src={getUserImgLink(avatar)} alt="user" />}
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
                      Set status
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

      {SidebarAuth(closeSidebar, sidebarOpened, username, avatar)}
      {StatusModal(showStatusModal, hideModal)}
    </div>
  );
};

HeaderDesktopAuth.propTypes = {
  openSidebar: PropTypes.func.isRequired,
  closeSidebar: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
  options: PropTypes.exact({
    username: PropTypes.string,
    avatar: PropTypes.string
  })
};

const Header = ({ isAuthorized, username, avatar }) => {
  return isAuthorized ? WithSidebar(HeaderDesktopAuth, { username, avatar }) : WithSidebar(HeaderDesktopUnauth);
};

const mapStateToProps = ({
  profile: {
    isAuthorized,
    currentUser: { username, avatar }
  }
}) => ({
  isAuthorized,
  username,
  avatar
});

export default connect(mapStateToProps)(Header);
