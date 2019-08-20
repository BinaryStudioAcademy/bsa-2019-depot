import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Calendar from 'react-github-contribution-calendar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Dropdown, Accordion } from 'semantic-ui-react';
import Octicon, { Repo, Grabber, Fold, Unfold, RepoPush } from '@primer/octicons-react';
import { repositoryActions } from '../../scenes/Dashboard/actions';

import styles from './styles.module.scss';

export class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: -1,
      currentYear: moment().year()
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchRepositories({
      limit: '4',
      filterWord: ''
    });
    actions.fetchActivity();
  }

  handleActivityState = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  currentYearContribution = () => {
    const { userActivityByDate } = this.props;
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
    const { userActivityByDate } = this.props;
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
    const { repositoriesNames, userActivityByDate, monthCommitsActivity, username } = this.props;
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
    panelColors = new Proxy(panelColors, {
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
      <div>
        <div className={styles.section}>
          <Container className={styles.section_header}>
            <h2>Pinned</h2>
            <Link to="" className={styles.header_actions}>
              Customize your pins
            </Link>
          </Container>
          <Container className={styles.favorite_repos_wrapper}>
            {repositoriesNames &&
              repositoriesNames.map(repo => {
                return (
                  <div key={repo} className={styles.pinned_item}>
                    <div>
                      <Octicon className={styles.card_icon} icon={Repo} />
                      <Link to={`${username}/${repo}`}>{repo}</Link>
                      <Octicon className={styles.card_icon_grab} icon={Grabber} />
                    </div>
                    <p className={styles.pinned_item_desc}> </p>
                    <p className={styles.pinned_item_lang}>
                      <span></span>Javascript
                    </p>
                  </div>
                );
              })}
          </Container>
        </div>

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
                    panelColors={panelColors}
                  />
                </div>
              </Container>

              <Container className={styles.section_header}>
                <h2>Contribution activity</h2>
              </Container>

              {Object.entries(monthCommitsActivity).length > 0 &&
                Object.entries(monthCommitsActivity).map(([date, monthActivityObject]) => {
                  const monthAndYear = moment(date).format('MMMM YYYY');
                  const commitCount = Object.keys(monthActivityObject).reduce(
                    (acc, key) => acc + monthActivityObject[key],
                    0
                  );
                  return (
                    <Container key={monthAndYear} className={styles.contribution_activity}>
                      <h3>{monthAndYear}</h3>
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
                            <p>Created {commitCount} commits</p>
                            <Octicon icon={activeIndex === `commit-${monthAndYear}` ? Fold : Unfold} />
                          </Accordion.Title>
                          <Accordion.Content active={activeIndex === `commit-${monthAndYear}`}>
                            {Object.entries(monthActivityObject).map(([repoName, repoCommits]) => {
                              const link = `${username}/${repoName}`;
                              return (
                                <div key={repoName}>
                                  <Link to={link} className={styles.activity_link}>
                                    {username}/{repoName}
                                  </Link>{' '}
                                  <span>{repoCommits} commits</span>
                                </div>
                              );
                            })}
                          </Accordion.Content>
                        </Accordion>
                      </div>
                    </Container>
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
      </div>
    );
  }
}

Overview.defaultProps = {
  panelColors: PropTypes.array,
  contributionValues: PropTypes.object.isRequired
};

Overview.propTypes = {
  actions: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  userActivityByDate: PropTypes.object.isRequired,
  monthCommitsActivity: PropTypes.object.isRequired,
  repositoriesNames: PropTypes.array.isRequired
};

const mapStateToProps = ({
  userStats: { userActivityByDate, monthCommitsActivity },
  profile: {
    currentUser: { username }
  }
}) => ({
  userActivityByDate,
  monthCommitsActivity,
  username
});

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...repositoryActions }, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
