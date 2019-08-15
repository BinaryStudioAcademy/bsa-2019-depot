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

  panelColors = [
    styles.activity_lvl1,
    styles.activity_lvl2,
    styles.activity_lvl3,
    styles.activity_lvl4,
    styles.activity_lvl5
  ];

  currentYearContribution = () => {
    const { monthCommitsActivity } = this.props;
    const { currentYear } = this.state;
    let counter = 0;
    for (const [date, commitCount] of Object.entries(monthCommitsActivity)) {
      const year = date.slice(0, 4);
      if (+year === currentYear) {
        counter += commitCount;
      }
    }
    return counter;
  };

  until = new Date().toISOString().slice(0, 10);

  render() {
    const { repositoriesNames, userActivityByDate, monthCommitsActivity } = this.props;
    const { activeIndex, currentYear } = this.state;
    const currentYearContribution = this.currentYearContribution();

    return (
      <div>
        <Container className={styles.pinned_header}>
          <h2>Pinned</h2>
          <Link to="">Customize your pins</Link>
        </Container>
        <Container className={styles.favorite_repos_wrapper}>
          {repositoriesNames &&
            repositoriesNames.map(repo => {
              return (
                <div key={repo} className={styles.pinned_item}>
                  <div>
                    <Octicon className={styles.card_icon} icon={Repo} />
                    <Link to="">{repo}</Link>
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
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column mobile={16} computer={13}>
              <Container className={styles.pinned_header}>
                <h2>
                  {currentYearContribution || 'No'} contributions in {currentYear}
                </h2>
                <Dropdown className={styles.dropdown_header} text="Contribution settings">
                  <Dropdown.Menu>
                    <Dropdown.Item text="Private contributions" />
                    <Dropdown.Item text="Activity overview" />
                  </Dropdown.Menu>
                </Dropdown>
              </Container>
              <Calendar
                values={userActivityByDate}
                until={this.until}
                weekNames={this.weekNames}
                monthNames={this.monthNames}
                panelColors={this.panelColors}
              />

              <Container className={styles.pinned_header}>
                <h2>Contribution activity</h2>
              </Container>

              {Object.entries(monthCommitsActivity).length > 0 &&
                Object.entries(monthCommitsActivity).map(([date, commitCount]) => {
                  const monthAndYear = moment(date).format('MMMM YYYY');
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
                          <Accordion.Content active={activeIndex === `commit-${monthAndYear}`}></Accordion.Content>
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

const mapStateToProps = ({ userStats: { userActivityByDate, monthCommitsActivity } }) => ({
  userActivityByDate,
  monthCommitsActivity
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
