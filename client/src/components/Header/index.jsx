import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Menu, Sidebar, Icon, Accordion } from 'semantic-ui-react';

import styles from './styles.module.scss';

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
        <svg height={32} viewBox="0 0 16 16" version="1.1" width={32} aria-hidden="true">
            <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
        </svg>
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
const WithSidebar = Comp => {
    const [sidebarOpened, setSidebarOpened] = useState(false);

    function closeSidebar() {
        setSidebarOpened(false);
    }
    function openSidebar() {
        setSidebarOpened(true);
    }

    return <Comp sidebarOpened={sidebarOpened} closeSidebar={closeSidebar} openSidebar={openSidebar} />;
};

const HeaderDesktopUnauth = ({ openSidebar, closeSidebar, sidebarOpened }) => (
    <div className={styles.headerWrp}>
        <Grid centered container>
            <Grid.Row>
                <Grid.Column width={10}>{MenuDesktop()}</Grid.Column>
                <Grid.Column width={6}>
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

const HeaderDesktopAuth = () => (
    <div className={styles.headerWrpAuth}>
        <Grid>
            <Grid.Column floated="left">
                <ul>
                    <li>{logo}</li>
                    <li>{SearchInp()}</li>
                    <li>
                        <a href="/">Link</a>
                    </li>
                    <li>
                        <a href="/">Link</a>
                    </li>
                    <li>
                        <a href="/">Link</a>
                    </li>
                    <li>
                        <a href="/">Link</a>
                    </li>
                </ul>
            </Grid.Column>
            <Grid.Column floated="right">
                <ul>
                    <li>
                        <a href="/">
                            <Icon name="bell" />
                        </a>
                    </li>
                    <li>
                        <Icon name="plus" />
                        <Icon name="dropdown" />
                    </li>
                    <li>
                        <Icon name="dropdown" />
                    </li>
                </ul>
            </Grid.Column>
        </Grid>
    </div>
);

const Header = () => {
    const auth = true; // <<< TODO: change it to real data
    return auth ? <HeaderDesktopAuth /> : WithSidebar(HeaderDesktopUnauth);
};

export default Header;
