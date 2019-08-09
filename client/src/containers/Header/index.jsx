import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Menu, Sidebar, Icon, Accordion, Dropdown, Responsive, Modal, Form, Button } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';
import { ReactComponent as HomeSVG } from '../../styles/assets/icons/home.svg';

const whyGitHub = (
  <Fragment>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item>
          <a href="/">
            <b>Features</b>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Code review</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Project management</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Integrations</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Actions</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Package registry</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Team management</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Social coding</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Documentation</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Code hosting</a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item>
          <a href="/">
            <b>Customer stories</b>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">
            <b>Security</b>
          </a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Fragment>
);

const enterprise = <a href="/">Enterprise</a>;

const explore = (
  <Fragment>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item>
          <a href="/">
            <b>Explore GitHub</b>
          </a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item name="Learn & contribute" />
        <Menu.Item>
          <a href="/">Topics</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Collections</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Trending</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Learning Lab</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Open source guides</a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item name="Connect with others" />
        <Menu.Item>
          <a href="/">Events</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Community forum</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">GitHub Education</a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Fragment>
);

const marketplace = <a href="/">Marketplace</a>;

const pricing = (
  <Fragment>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item>
          <a href="/">
            <b>Plans</b>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Compare plans</a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">Contact Sales</a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      <Menu.Menu>
        <Menu.Item>
          <a href="/">
            <b>Nonprofit</b>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="/">
            <b>Education</b>
          </a>
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Fragment>
);

const SearchInp = () => {
  const [text, setText] = useState('');
  function onTextChange({ target }) {
    setText(target.value);
  }

  return <input placeholder="Search GitHub" onChange={onTextChange} value={text} type="text" />;
};

const signIn = <a href="/">Sign in</a>;
const signUp = <a href="/">Sign up</a>;
const logo = (
  <a className={styles.logo} href="/">
    <HomeSVG width={32} height={32} />
  </a>
);

const SidebarUnauth = (closeSidebar, sidebarOpened) => {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

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
      <Menu.Item as="div">
        <Accordion>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
            Why GitHub?
            <Icon name="dropdown" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>{whyGitHub}</Accordion.Content>
        </Accordion>
      </Menu.Item>
      <Menu.Item as="div">
        <Accordion>
          <Accordion.Title>{enterprise}</Accordion.Title>
        </Accordion>
      </Menu.Item>
      <Menu.Item as="div">
        <Accordion>
          <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClick}>
            Explore
            <Icon name="dropdown" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>{explore}</Accordion.Content>
        </Accordion>
      </Menu.Item>
      <Menu.Item as="div">
        <Accordion>
          <Accordion.Title>{marketplace}</Accordion.Title>
        </Accordion>
      </Menu.Item>
      <Menu.Item as="div">
        <Accordion>
          <Accordion.Title active={activeIndex === 3} index={3} onClick={handleClick}>
            Pricing
            <Icon name="dropdown" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 3}>{pricing}</Accordion.Content>
        </Accordion>
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
    <li>
      <p>
        Why GitHub?
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 960 560"
          enableBackground="new 0 0 960 560"
          xmlSpace="preserve"
        >
          <g id="Rounded_Rectangle_33_copy_4_1_">
            <path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" />
          </g>
        </svg>
      </p>
      <Menu className={styles.dropDown} vertical>
        {whyGitHub}
      </Menu>
    </li>
    <li>{enterprise}</li>
    <li>
      <p>
        Explore
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 960 560"
          enableBackground="new 0 0 960 560"
          xmlSpace="preserve"
        >
          <g id="Rounded_Rectangle_33_copy_4_1_">
            <path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" />
          </g>
        </svg>
      </p>
      <Menu className={styles.dropDown} vertical>
        {explore}
      </Menu>
    </li>
    <li>{marketplace}</li>
    <li>
      <p>
        Pricing
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 960 560"
          enableBackground="new 0 0 960 560"
          xmlSpace="preserve"
        >
          <g id="Rounded_Rectangle_33_copy_4_1_">
            <path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" />
          </g>
        </svg>
      </p>
      <Menu className={styles.dropDown} vertical>
        {pricing}
      </Menu>
    </li>
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
        <Grid.Column computer={10} mobile={8}>
          {MenuDesktop()}
        </Grid.Column>
        <Grid.Column computer={6} mobile={8}>
          <div className={styles.form}>
            {SearchInp()}
            {signIn}
            {signUp}
            <svg
              className={styles.burger}
              onClick={openSidebar}
              height={24}
              viewBox="0 0 12 16"
              version="1.1"
              width={18}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
              />
            </svg>
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
const issues = <a href="/">Issues</a>;

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
    <Menu.Item as="div">{issues}</Menu.Item>
    <Menu.Item as="div">
      <a href="/">
        {<img src={getUserImgLink(avatar)} alt="user" />}
        {userName}
      </a>
    </Menu.Item>
    <Menu.Item as="div">
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
            <Button type="submit" color="green" fluid>
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
        <Grid.Column computer={7} floated="left">
          <Responsive minWidth={1200}>
            <ul>
              <li>{logo}</li>
              <li>{SearchInp()}</li>
              <li>{pullRequests}</li>
              <li>{issues}</li>
            </ul>
          </Responsive>
          <Responsive maxWidth={1200}>
            <svg
              className={styles.burger}
              onClick={openSidebar}
              height={24}
              viewBox="0 0 12 16"
              version="1.1"
              width={18}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"
              />
            </svg>
          </Responsive>
        </Grid.Column>

        <Grid.Column computer={5}>
          <Responsive maxWidth={1200}>{logo}</Responsive>
        </Grid.Column>
        <Grid.Column computer={4} floated="right">
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
                  <Dropdown.Item>New repository</Dropdown.Item>
                  <Dropdown.Item>Import repository</Dropdown.Item>
                  <Dropdown.Item>New organization</Dropdown.Item>
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
                      <Icon color="black" name="smile outline" />
                      Set status
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item>Your profile</Dropdown.Item>
                  <Dropdown.Item>Your repositories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item>Settings</Dropdown.Item>
                  <Dropdown.Item>Sign out</Dropdown.Item>
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
    username: PropTypes.string.isRequired,
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
