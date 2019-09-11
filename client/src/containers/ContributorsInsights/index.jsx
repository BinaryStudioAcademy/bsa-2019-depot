import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { getCommitActivityByUser } from '../../services/repositoryService';

import { Segment, Image, Loader, Container, Icon, Header, Divider } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

class ContributorsInsights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersActivity: [],
      defaultBranchActivity: [],
      loading: true
    };
  }

  async componentDidMount() {
    const { repoId } = this.props;
    const { usersActivity, defaultBranchActivity } = await getCommitActivityByUser(repoId);
    this.setState({ usersActivity, defaultBranchActivity, loading: false });
  }

  render() {
    const { usersActivity, defaultBranchActivity, loading } = this.state;
    const { createdRepoDate, defaultBranch, reponame } = this.props;
    const defaultBranchActivityData = defaultBranchActivity.map(({ date, value }) => ({
      value,
      date: moment(date).format('MMM DD, YYYY')
    }));

    return loading ? (
      <div>
        <Loader active />
      </div>
    ) : !usersActivity.length && !defaultBranchActivity.length ? (
      <Container textAlign="center">
        <Icon size="big" name="chart bar outline" />
        <Divider hidden />
        <Header as="h2">Welcome to the {reponame} graphs!</Header>
        <Segment basic>
          Once code is added to this repository, you’ll be able to see graphs for the commit timeline and forking
          activity.
        </Segment>
      </Container>
    ) : !defaultBranch ? (
      <Container textAlign="center">
        <Octicon icon={getIconByName('git-pull-request')} />
        <Divider hidden />
        <Header as="h2">The default branch isn't set</Header>
      </Container>
    ) : (
      <Segment basic>
        <div className={styles.contributorsHeader}>
          <h2 className={styles.timeDuration}>
            {moment(createdRepoDate).format('MMM DD, YYYY')} – {moment().format('MMM DD, YYYY')}
          </h2>
        </div>
        <p className={styles.chartInfo}>Contributions to {defaultBranch.name}, excluding merge commits</p>
        <div className={styles.allContributorsChart}>
          <ResponsiveContainer width="100%" height={125}>
            <AreaChart data={defaultBranchActivityData}>
              <XAxis dataKey="date" />
              <YAxis axisLine={false} allowDecimals={false} width={13} dataKey="value" />
              <CartesianGrid vertical={false} />
              <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.contributorsGrid}>
          {usersActivity.map(({ username, commitsCount, activity, imgUrl }, idx) => {
            const usersActivityData = activity.map(({ date, value }) => ({
              value,
              date: moment(date).format('MMM DD, YYYY')
            }));
            return (
              <div key={idx} className={styles.contributorsBox}>
                <div className={styles.contributorsBoxHeader}>
                  <Image src={imgUrl} alt="contributors avatar" className={styles.contributorsImage} />
                  <div className={styles.contributorsInfo}>
                    <Link to={`/${username}`} className={styles.contributorsLink}>
                      {username}
                    </Link>
                    <span className={styles.contributorsCommitCount}>{commitsCount} commits</span>
                  </div>
                </div>
                <div className={styles.contributorsChart}>
                  <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={usersActivityData}>
                      <XAxis dataKey="date" />
                      <YAxis axisLine={false} allowDecimals={false} width={13} dataKey="value" />
                      <CartesianGrid vertical={false} />
                      <Area type="monotone" dataKey="value" stroke="#fb8532" fillOpacity={1} fill="#fb8532" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </Segment>
    );
  }
}

ContributorsInsights.propTypes = {
  repoId: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  createdRepoDate: PropTypes.string.isRequired,
  defaultBranch: PropTypes.object.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id: repoId, createdAt: createdRepoDate, defaultBranch, name: reponame }
    }
  }
}) => ({
  repoId,
  createdRepoDate,
  defaultBranch,
  reponame
});

export default connect(mapStateToProps)(ContributorsInsights);
