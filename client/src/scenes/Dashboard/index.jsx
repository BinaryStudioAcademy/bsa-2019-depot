import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Calendar from 'react-github-contribution-calendar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Grid, Dropdown, Accordion, Button } from 'semantic-ui-react';
import Octicon, { Repo, Grabber, Fold, Unfold, RepoPush, GitPullRequest, Smiley } from '@primer/octicons-react';
import { repositoryActions } from './actions';

import styles from './styles.module.scss';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1
        };
    }

    componentDidMount() {
        const { actions } = this.props;
        actions.fetchRepositories({
            limit: '',
            filterWord: ''
        });
    }

  handleActivityState = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex });
  };

  panelColors = ['#EEEEEE', '#D6E685', '#8CC665', '#44A340', '#1E6823'];

  contributionValues = {
      // mock, must be replaced with real data
      '2019-07-23': 1,
      '2019-07-26': 2,
      '2019-07-27': 3,
      '2019-07-28': 4,
      '2019-07-29': 4
  };

  username = 'octocat';

  userActivity = [
      // mock, must be replaced with real data
      {
          year: 2019,
          month: 'August',
          commitCount: 25,
          commitRepoCount: 1,
          commitRepoNames: {
              myFirstFavoriteRepo: 25
          },
          createdRepoCount: 1,
          createdRepoNames: ['my_third_favorite_repo'],
          requestCount: 5,
          requestRepoNames: {
              myFirstFavoriteRepo: 5
          }
      },
      {
          year: 2019,
          month: 'July',
          commitCount: 6,
          commitRepoCount: 3,
          commitRepoNames: {
              mySecondFavoriteRepo: 1,
              myFirstFavoriteRepo: 4,
              myThirdFavoriteRepo: 1
          }
      },
      {
          year: 2019,
          month: 'June',
          commitCount: 3,
          commitRepoCount: 2,
          commitRepoNames: {
              myFirstFavoriteRepo: 1,
              mySecondFavoriteRepo: 2
          }
      }
  ];

  until = new Date().toISOString().slice(0, 10);

  render() {
      const { activeIndex } = this.state;
      const { repositoriesNames } = this.props;

      return (
          <Container className={styles.wrapper}>
              <Grid>
                  <Grid.Row columns={2}>
                      <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={4} computer={4}>
                          <div className={styles.avatar_wrapper}>
                              <Link to="">
                                  <img src="http://cameronmcefee.com/img/work/the-octocat/ironcat.jpg" alt="user_avatar" />
                              </Link>
                              <Link to="" className={styles.set_status}>
                                  <Octicon icon={Smiley} />
                  Set status
                              </Link>
                          </div>
                          <h1 className={styles.username}>octocat</h1>
                          <Button fluid basic className={styles.edit_profile}>
                Edit profile
                          </Button>
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={12} computer={12}>
                          <Container className={styles.navbar_wrapper}>
                              <nav className={styles.navbar}>
                                  <Link to="" className={styles.active_link}>
                    Overview
                                  </Link>
                                  <Link to="">
                    Repositories<span>15</span>
                                  </Link>
                                  <Link to="">
                    Projects<span>2</span>
                                  </Link>
                                  <Link to="">
                    Stars<span>128</span>
                                  </Link>
                                  <Link to="">
                    Followers<span>8</span>
                                  </Link>
                                  <Link to="">
                    Following<span>19</span>
                                  </Link>
                              </nav>
                          </Container>
                          <Container className={styles.pinned_header}>
                              <h2>Pinned</h2>
                              <Link to="">Customize your pins</Link>
                          </Container>
                          <Container className={styles.favorite_repos_wrapper}>
                              {repositoriesNames.map(repo => {
                                  return (
                                      <div key={repo} className={styles.pinned_item}>
                                          <div>
                                              <Octicon className={styles.card_icon} icon={Repo} />
                                              <Link to="">{repo}</Link>
                                              <Octicon className={styles.card_icon_grab} icon={Grabber} />
                                          </div>
                                          <p className={styles.pinned_item_desc}>Some kind of description</p>
                                          <p className={styles.pinned_item_lang}>
                                              <span></span>Javascript
                                          </p>
                                      </div>
                                  );
                              })}
                          </Container>
                          <Grid>
                              <Grid.Row columns={2}>
                                  <Grid.Column mobile={16} computer={13}>
                                      <Container className={styles.pinned_header}>
                                          <h2>275 contributions in 2019</h2>
                                          <Dropdown className={styles.dropdown_header} text="Contribution settings">
                                              <Dropdown.Menu>
                                                  <Dropdown.Item text="Private contributions" />
                                                  <Dropdown.Item text="Activity overview" />
                                              </Dropdown.Menu>
                                          </Dropdown>
                                      </Container>
                                      <Calendar
                                          values={this.contributionValues}
                                          until={this.until}
                                          weekNames={this.weekNames}
                                          monthNames={this.monthNames}
                                          panelColors={this.panelColors}
                                      />

                                      <Container className={styles.pinned_header}>
                                          <h2>Contribution activity</h2>
                                      </Container>

                                      {this.userActivity.map(
                                          (
                                              {
                                                  year,
                                                  month,
                                                  commitCount,
                                                  commitRepoCount,
                                                  commitRepoNames,
                                                  createdRepoCount,
                                                  createdRepoNames,
                                                  requestCount,
                                                  requestRepoNames
                                              },
                                              idx
                                          ) => (
                                              <Container key={month} className={styles.contribution_activity}>
                                                  <h3>{`${month} ${year}`}</h3>
                                                  {commitCount && (
                                                      <div className={styles.contribution_activity_desc}>
                                                          <span className={styles.contribution_activity_icon}>
                                                              <Octicon icon={RepoPush} />
                                                          </span>
                                                          <Accordion>
                                                              <Accordion.Title
                                                                  active={activeIndex === `commit-${idx}`}
                                                                  index={`commit-${idx}`}
                                                                  onClick={this.handleActivityState}
                                                              >
                                                                  <p>
                                    Created {commitCount} commits in {commitRepoCount} repository
                                                                  </p>
                                                                  <Octicon icon={activeIndex === `commit-${idx}` ? Fold : Unfold} />
                                                              </Accordion.Title>
                                                              <Accordion.Content active={activeIndex === `commit-${idx}`}>
                                                                  {Object.entries(commitRepoNames).map((val, i) => (
                                                                      <Link to="" key={`commit-${i}`} className={styles.activity_link}>
                                                                          {this.username}/{val[0]} {val[1]} commits
                                                                      </Link>
                                                                  ))}
                                                              </Accordion.Content>
                                                          </Accordion>
                                                      </div>
                                                  )}
                                                  {createdRepoCount && (
                                                      <div className={styles.contribution_activity_desc}>
                                                          <span className={styles.contribution_activity_icon}>
                                                              <Octicon icon={Repo} />
                                                          </span>
                                                          <Accordion>
                                                              <Accordion.Title
                                                                  active={activeIndex === `repo-${idx}`}
                                                                  index={`repo-${idx}`}
                                                                  onClick={this.handleActivityState}
                                                              >
                                                                  <p>Created {createdRepoCount} repository</p>
                                                                  <Octicon icon={activeIndex === `repo-${idx}` ? Fold : Unfold} />
                                                              </Accordion.Title>
                                                              <Accordion.Content active={activeIndex === `repo-${idx}`}>
                                                                  {createdRepoNames.map((repoName, i) => (
                                                                      <Link to="" key={`repo-${i}`} className={styles.activity_link}>
                                                                          {this.username}/{repoName}
                                                                      </Link>
                                                                  ))}
                                                              </Accordion.Content>
                                                          </Accordion>
                                                      </div>
                                                  )}
                                                  {requestCount && (
                                                      <div className={styles.contribution_activity_desc}>
                                                          <span className={styles.contribution_activity_icon}>
                                                              <Octicon icon={GitPullRequest} />
                                                          </span>
                                                          <Accordion>
                                                              <Accordion.Title
                                                                  active={activeIndex === idx}
                                                                  index={idx}
                                                                  onClick={this.handleActivityState}
                                                              >
                                                                  <p>Opened {requestCount} pull requests</p>
                                                                  <Octicon icon={activeIndex === idx ? Fold : Unfold} />
                                                              </Accordion.Title>
                                                              <Accordion.Content active={activeIndex === idx}>
                                                                  {Object.entries(requestRepoNames).map((val, i) => (
                                                                      <Link to="" key={`request-${i}`} className={styles.activity_link}>
                                                                          {this.username}/{val[0]} {val[1]} requests
                                                                      </Link>
                                                                  ))}
                                                              </Accordion.Content>
                                                          </Accordion>
                                                      </div>
                                                  )}
                                              </Container>
                                          )
                                      )}
                                      <Link to="" className={styles.load_more_activity}>
                      Show more activity
                                      </Link>
                                  </Grid.Column>
                                  <Grid.Column width={3} only="computer">
                                      <ul className={styles.contribution_year_list}>
                                          <li>
                                              <Link to="" className={styles.contribution_year__active}>
                          2019
                                              </Link>
                                          </li>
                                          <li>
                                              <Link to="" className={styles.contribution_year}>
                          2018
                                              </Link>
                                          </li>
                                          <li>
                                              <Link to="" className={styles.contribution_year}>
                          2017
                                              </Link>
                                          </li>
                                      </ul>
                                  </Grid.Column>
                              </Grid.Row>
                          </Grid>
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </Container>
      );
  }
}

Dashboard.defaultProps = {};

Dashboard.propTypes = {
    actions: PropTypes.object.isRequired,
    repositoriesNames: PropTypes.array.isRequired
};

const mapStateToProps = ({ repositories }) => ({
    repositoriesNames: repositories.repositoriesNames
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ ...repositoryActions }, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
