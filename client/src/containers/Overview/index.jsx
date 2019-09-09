import React, { Fragment } from 'react';
import moment from 'moment';
import Calendar from 'react-github-contribution-calendar';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Container, Grid, Dropdown, Accordion } from 'semantic-ui-react';
import Octicon, { Fold, Unfold, RepoPush, Repo } from '@primer/octicons-react';
import * as commitsService from '../../services/commitsService';
import PinnedRepositories from '../../components/PinnedRepositories';

import styles from './styles.module.scss';

export class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      currentYear: moment().year(),
      userActivity: {
        userActivityByDate: {},
        userMonthActivity: {}
      }
    };
  }

  async getActivity(username) {
    const { monthActivity, userActivitybyDate } = await commitsService.getAllUserCommits(username);
    this.setState({
      ...this.state,
      userActivity: {
        userMonthActivity: monthActivity,
        userActivityByDate: userActivitybyDate
      }
    });
  }

  fetchData() {
    const {
      match: {
        params: { username }
      }
    } = this.props;
    this.getActivity(username);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps) {
      return false;
    }
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  handleActivityState = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  currentYearContribution = () => {
    const {
      userActivity: { userActivityByDate }
    } = this.state;
    const { currentYear } = this.state;
    let counter = 0;
    for (const [date, commitCount] of Object.entries(userActivityByDate)) {
      const year = date.slice(0, 4);
      if (+year === currentYear) {
        counter += commitCount;
      }
    }
    return counter;
  };

  getYearList = () => {
    const {
      userActivity: { userActivityByDate }
    } = this.state;
    let years = [];
    for (const date of Object.keys(userActivityByDate)) {
      const year = date.slice(0, 4);
      if (!years.includes(year)) {
        years.push(year);
      }
    }
    return years;
  };

  until = new Date().toISOString().slice(0, 10);

  render() {
    const {
      match: {
        params: { username }
      },
      userId
    } = this.props;

    const {
      userActivity: { userActivityByDate, userMonthActivity }
    } = this.state;
    const { activeIndex, currentYear } = this.state;
    const currentYearContribution = this.currentYearContribution();
    const yearList = this.getYearList();

    let panelColors = [
      styles.activity_lvl1,
      styles.activity_lvl2,
      styles.activity_lvl3,
      styles.activity_lvl4,
      styles.activity_lvl5
    ];
    const proxyPanelColors = new Proxy(panelColors, {
      get(target, prop) {
        prop = +prop;
        if (prop === 0) {
          return target[0];
        } else if (prop > 0 && prop < 10) {
          return target[1];
        } else if (prop >= 10 && prop < 20) {
          return target[2];
        } else if (prop >= 20 && prop < 30) {
          return target[3];
        } else if (prop >= 30) {
          return target[4];
        } else {
          return target[0];
        }
      }
    });
    return (
      <>
        <PinnedRepositories username={username} userId={userId} repositories={this.state.repositories} />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column mobile={16} computer={13}>
              <Container className={styles.section}>
                <Container className={styles.section_header}>
                  <h2>
                    {currentYearContribution || 'No'} contributions in {currentYear} year
                  </h2>
                  <Dropdown className={styles.header_actions} text="Contribution settings">
                    <Dropdown.Menu>
                      <Dropdown.Item text="Private contributions" />
                      <Dropdown.Item text="Activity overview" />
                    </Dropdown.Menu>
                  </Dropdown>
                </Container>
                <div className={styles.calendarContainer}>
                  <Calendar
                    values={userActivityByDate}
                    until={this.until}
                    weekNames={this.weekNames}
                    monthNames={this.monthNames}
                    panelColors={proxyPanelColors}
                  />
                  <div className="calendar-wrapper calendar-wrapper-meaning">
                    {'Less '}
                    <svg className="calendar calendar-meaning" height="11">
                      {panelColors.map((color, i) => (
                        <rect key={i} x={13 * i} y="0" width="11" height="11" fill={color}></rect>
                      ))}
                    </svg>
                    {' More'}
                  </div>
                </div>
              </Container>
              <Container className={styles.section_header}>
                <h2>Contribution activity</h2>
              </Container>
              {Object.entries(userMonthActivity).length > 0 &&
                Object.entries(userMonthActivity)
                  .sort((prev, next) => moment(next[0]).diff(moment(prev[0])))
                  .map(([date, monthActivityObject]) => {
                    const monthAndYear = moment(date).format('MMMM YYYY');
                    const commitCount =
                      monthActivityObject.commits &&
                      Object.keys(monthActivityObject.commits).reduce((acc, key) => {
                        return acc + monthActivityObject.commits[key];
                      }, 0);
                    const numOfCreatedRepos =
                      monthActivityObject.createdRepos && monthActivityObject.createdRepos.length;
                    const numOfCommittedRepos =
                      monthActivityObject.commits && Object.keys(monthActivityObject.commits).length;
                    return (
                      <Fragment key={date}>
                        <Container key={monthAndYear} className={styles.contribution_activity}>
                          <h3>{monthAndYear}</h3>
                          {monthActivityObject.commits && (
                            <div className={styles.contribution_activity_desc}>
                              <span className={styles.contribution_activity_icon}>
                                <Octicon icon={RepoPush} />
                              </span>
                              <Accordion>
                                <Accordion.Title
                                  active={activeIndex === `commit-${monthAndYear}`}
                                  index={`commit-${monthAndYear}`}
                                  onClick={this.handleActivityState}
                                >
                                  <p>
                                    Created {commitCount} commit{commitCount === 1 ? '' : 's'} in {numOfCommittedRepos}{' '}
                                    repositor
                                    {numOfCommittedRepos === 1 ? 'y' : 'ies'}
                                  </p>
                                  <Octicon icon={activeIndex === `commit-${monthAndYear}` ? Fold : Unfold} />
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === `commit-${monthAndYear}`}>
                                  {Object.entries(monthActivityObject.commits).map(([repoName, repoCommits]) => {
                                    const link = `${username}/${repoName}`;
                                    return (
                                      <div key={repoName}>
                                        <Link to={link} className={styles.activity_link}>
                                          {username}/{repoName}
                                        </Link>{' '}
                                        <span>
                                          {repoCommits} commit{repoCommits === 1 ? '' : 's'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </Accordion.Content>
                              </Accordion>
                            </div>
                          )}
                          {monthActivityObject.createdRepos && (
                            <div className={styles.contribution_activity_desc}>
                              <span className={styles.contribution_activity_icon}>
                                <Octicon icon={Repo} />
                              </span>
                              <Accordion>
                                <Accordion.Title
                                  active={activeIndex === `repo-${monthAndYear}`}
                                  index={`repo-${monthAndYear}`}
                                  onClick={this.handleActivityState}
                                >
                                  <p>
                                    Created {numOfCreatedRepos} repositor
                                    {numOfCreatedRepos === 1 ? 'y' : 'ies'}
                                  </p>
                                  <Octicon icon={activeIndex === `repo-${monthAndYear}` ? Fold : Unfold} />
                                </Accordion.Title>
                                <Accordion.Content active={activeIndex === `repo-${monthAndYear}`}>
                                  {monthActivityObject.createdRepos.map(repoName => {
                                    const link = `${username}/${repoName}`;
                                    return (
                                      <div key={repoName}>
                                        <Link to={link} className={styles.activity_link}>
                                          {username}/{repoName}
                                        </Link>{' '}
                                      </div>
                                    );
                                  })}
                                </Accordion.Content>
                              </Accordion>
                            </div>
                          )}
                        </Container>
                      </Fragment>
                    );
                  })}

              {/* <Link to="" className={styles.load_more_activity}>
                Show more activity
              </Link> */}
            </Grid.Column>
            <Grid.Column width={3} only="computer">
              <ul className={styles.contribution_year_list}>
                {yearList.map(year => (
                  <li key={year}>
                    <Link to="" className={[styles.contribution_year, styles.active].join(' ')}>
                      {year}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

Overview.defaultProps = {
  panelColors: PropTypes.array,
  contributionValues: PropTypes.object.isRequired,
  userActivityByDate: {},
  userMonthActivity: {}
};

Overview.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  userActivityByDate: PropTypes.object.isRequired,
  userMonthActivity: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired
};

export default withRouter(Overview);
