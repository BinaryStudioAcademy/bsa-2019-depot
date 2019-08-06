import React, { Component } from 'react';
import Calendar from 'react-github-contribution-calendar';
import PropTypes from 'prop-types';
import { Container, Grid, Dropdown, Accordion, Button } from 'semantic-ui-react';
import Octicon, { Repo, Grabber, Fold, Unfold, RepoPush, GitPullRequest, Smiley } from '@primer/octicons-react';

import styles from './styles.module.scss';

class Dashboard extends Component {
  state = {
      activeIndex: -1
  };

  handleActivityState = (e, titleProps) => {
      const { index } = titleProps;
      const { activeIndex } = this.state;
      const newIndex = activeIndex === index ? -1 : index;
      this.setState({ activeIndex: newIndex });
  };

  panelColors = ['#EEEEEE', '#D6E685', '#8CC665', '#44A340', '#1E6823'];

  values = {
      //mock, must be replaced with real data
      '2019-07-23': 1,
      '2019-07-26': 2,
      '2019-07-27': 3,
      '2019-07-28': 4,
      '2019-07-29': 4
  };

  until = new Date().toISOString().slice(0, 10);

  render() {
      const { activeIndex } = this.state;

      return (
          <Container className={styles.wrapper}>
              <Grid>
                  <Grid.Row columns={2}>
                      <Grid.Column className={styles.userinfo_wrapper} mobile={16} tablet={4} computer={4}>
                          <div className={styles.avatar_wrapper}>
                              <a href="">
                                  <img src="http://cameronmcefee.com/img/work/the-octocat/ironcat.jpg" alt="user_avatar" />
                              </a>
                              <a className={styles.set_status} href="">
                                  <Octicon icon={Smiley} />
                  Set status
                              </a>
                          </div>
                          <h1 className={styles.username}>octocat</h1>
                          <Button fluid basic className={styles.edit_profile}>
                Edit profile
                          </Button>
                      </Grid.Column>
                      <Grid.Column mobile={16} tablet={12} computer={12}>
                          <Container>
                              <nav className={styles.navbar}>
                                  <a className={styles.active_link} href="#">
                    Overview
                                  </a>
                                  <a href="#">
                    Repositories
                                      <span>15</span>
                                  </a>
                                  <a href="#">
                    Projects
                                      <span>2</span>
                                  </a>
                                  <a href="#">
                    Stars
                                      <span>128</span>
                                  </a>
                                  <a href="#">
                    Followers
                                      <span>8</span>
                                  </a>
                                  <a href="#">
                    Following
                                      <span>19</span>
                                  </a>
                              </nav>
                          </Container>
                          <Container className={styles.pinned_header}>
                              <h2>Pinned</h2>
                              <a href="">Customize your pins</a>
                          </Container>
                          <Grid>
                              <Grid.Row columns={2}>
                                  <Grid.Column className={styles.pinned} mobile={16} tablet={8} computer={8}>
                                      <div className={styles.pinned_item}>
                                          <div>
                                              <Octicon className={styles.card_icon} icon={Repo} />
                                              <a href="">My first favorite repo</a>
                                              <Octicon className={styles.card_icon_grab} icon={Grabber} />
                                          </div>
                                          <p className={styles.pinned_item_desc}>I don't know what's in it</p>
                                          <p className={styles.pinned_item_lang}>
                                              <span></span>
                        Javascript
                                          </p>
                                      </div>
                                      <div className={styles.pinned_item}>
                                          <div>
                                              <Octicon className={styles.card_icon} icon={Repo} />
                                              <a href="">My second favorite repo</a>
                                              <Octicon className={styles.card_icon_grab} icon={Grabber} />
                                          </div>
                                          <p className={styles.pinned_item_lang}>
                                              <span></span>
                        C++
                                          </p>
                                      </div>
                                  </Grid.Column>
                                  <Grid.Column className={styles.pinned} mobile={16} tablet={8} computer={8}>
                                      <div className={styles.pinned_item}>
                                          <div>
                                              <Octicon className={styles.card_icon} icon={Repo} />
                                              <a href="">My third favorite repo</a>
                                              <Octicon className={styles.card_icon_grab} icon={Grabber} />
                                          </div>
                                          <p className={styles.pinned_item_lang}>
                                              <span></span>
                        Java
                                          </p>
                                      </div>
                                  </Grid.Column>
                              </Grid.Row>
                          </Grid>
                          <Grid>
                              <Grid.Row columns={2}>
                                  <Grid.Column mobile={16} computer={13}>
                                      <Container className={styles.pinned_header}>
                                          <h2>275 contributions in 2019</h2>
                                          <Dropdown text="Contribution settings">
                                              <Dropdown.Menu>
                                                  <Dropdown.Item text="Private contributions" />
                                                  <Dropdown.Item text="Activity overview" />
                                              </Dropdown.Menu>
                                          </Dropdown>
                                      </Container>
                                      <Calendar
                                          values={this.values}
                                          until={this.until}
                                          weekNames={this.weekNames}
                                          monthNames={this.monthNames}
                                          panelColors={this.panelColors}
                                      />

                                      <Container className={styles.pinned_header}>
                                          <h2>Contribution activity</h2>
                                      </Container>
                                      <Container className={styles.contribution_activity}>
                                          <h3>August 2019</h3>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={RepoPush} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleActivityState}>
                                                      <p>Created 25 commits in 1 repository</p>
                                                      <Octicon icon={activeIndex === 0 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 0}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 25 commits</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={Repo} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleActivityState}>
                                                      <p>Created 1 repository</p>
                                                      <Octicon icon={activeIndex === 1 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 1}>
                                                      <a className={styles.activity_link}>octocat/my_third_favorite_repo</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={GitPullRequest} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleActivityState}>
                                                      <p>Opened 5 pull requests</p>
                                                      <Octicon icon={activeIndex === 2 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 2}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 5 pull requests</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                      </Container>
                                      <Container className={styles.contribution_activity}>
                                          <h3>July 2019</h3>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={RepoPush} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleActivityState}>
                                                      <p>Created 6 commits in 3 repository</p>
                                                      <Octicon icon={activeIndex === 3 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 3}>
                                                      <a className={styles.activity_link}>octocat/my_second_favorite_repo 1 commit</a>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 4 commits</a>
                                                      <a className={styles.activity_link}>octocat/my_third_favorite_repo 1 commit</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                      </Container>
                                      <Container className={styles.contribution_activity}>
                                          <h3>June 2019</h3>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={RepoPush} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleActivityState}>
                                                      <p>Created 3 commits in 2 repositories</p>
                                                      <Octicon icon={activeIndex === 4 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 4}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 1 commit</a>
                                                      <a className={styles.activity_link}>octocat/my_second_favorite_repo 2 commits</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                      </Container>
                                      <Container className={styles.contribution_activity}>
                                          <h3>May 2019</h3>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={RepoPush} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 5} index={5} onClick={this.handleActivityState}>
                                                      <p>Created 4 commits in 2 repositories</p>
                                                      <Octicon icon={activeIndex === 5 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 5}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 2 commits</a>
                                                      <a className={styles.activity_link}>octocat/my_second_favorite_repo 2 commits</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                      </Container>
                                      <Container className={styles.contribution_activity}>
                                          <h3>April 2019</h3>

                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={RepoPush} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 6} index={6} onClick={this.handleActivityState}>
                                                      <p>Created 5 commits in 1 repository</p>
                                                      <Octicon icon={activeIndex === 6 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 6}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 3 commits</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={Repo} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 7} index={7} onClick={this.handleActivityState}>
                                                      <p>Created 2 repositories</p>
                                                      <Octicon icon={activeIndex === 7 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 7}>
                                                      <a className={styles.activity_link}>octocat/my_third_favorite_repo</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                          <div className={styles.contribution_activity_desc}>
                                              <span className={styles.contribution_activity_icon}>
                                                  <Octicon icon={GitPullRequest} />
                                              </span>
                                              <Accordion>
                                                  <Accordion.Title active={activeIndex === 8} index={8} onClick={this.handleActivityState}>
                                                      <p>Opened 2 pull requests</p>
                                                      <Octicon icon={activeIndex === 8 ? Fold : Unfold} />
                                                  </Accordion.Title>
                                                  <Accordion.Content active={activeIndex === 8}>
                                                      <a className={styles.activity_link}>octocat/my_first_favorite_repo 2 pull requests</a>
                                                  </Accordion.Content>
                                              </Accordion>
                                          </div>
                                      </Container>
                                      <a className={styles.load_more_activity}>Show more activity</a>
                                  </Grid.Column>
                                  <Grid.Column width={3} only="computer">
                                      <ul className={styles.contribution_year_list}>
                                          <li>
                                              <a className={styles.contribution_year__active} href="">
                          2019
                                              </a>
                                          </li>
                                          <li>
                                              <a className={styles.contribution_year} href="">
                          2018
                                              </a>
                                          </li>
                                          <li>
                                              <a className={styles.contribution_year} href="">
                          2017
                                              </a>
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
    username: PropTypes.string
};

export default Dashboard;
