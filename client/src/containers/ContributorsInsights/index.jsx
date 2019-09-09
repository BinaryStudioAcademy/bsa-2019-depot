import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import { getCommitActivityByUser } from '../../services/repositoryService';

import { Segment, Image } from 'semantic-ui-react';
import styles from './styles.module.scss';

class ContributorsInsights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contributorsInfo: [],
      data: [
        {
          date: '15 Aug, 2019',
          commits: 34
        },
        {
          date: '21 Aug, 2019',
          commits: 14
        },
        {
          date: '25 Aug, 2019',
          commits: 7
        },
        {
          date: '28 Aug, 2019',
          commits: 10
        },
        {
          date: '29 Aug, 2019',
          commits: 15
        },
        {
          date: '30 Aug, 2019',
          commits: 20
        },
      ]
    };
  }

  async componentDidMount() {
    const { repoId } = this.props;
    const contributorsInfo = await getCommitActivityByUser(repoId);
    this.setState({ contributorsInfo });
  }

  render() {
    const { contributorsInfo, data } = this.state;
    const { createdRepoDate } = this.props;

    return (
      <Segment basic>
        <div className={styles.contributorsHeader}>
          <h2 className={styles.timeDuration}>{moment(createdRepoDate).format('MMM DD, YYYY')} – {moment().format('MMM DD, YYYY')}</h2>
        </div>
        <p className={styles.chartInfo}>Contributions to develop, excluding merge commits</p>
        <div className={styles.allContributorsChart}>
          <ResponsiveContainer width="100%" height={125}>
            <AreaChart data={data}>
              <XAxis dataKey="date" />
              <YAxis axisLine={false} width={13} dataKey="commits" />
              <CartesianGrid vertical={false} />
              <Area type="monotone" dataKey="commits" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.contributorsGrid}>
          {contributorsInfo.map(({ username, commitsCount, activity, imgUrl }, idx) => {
            const data = activity.map(({ date, value }) => ({ value, date: moment(date).format('MMM DD, YYYY') }));
            return (
              <div key={idx} className={styles.contributorsBox}>
                <div className={styles.contributorsBoxHeader}>
                  <Image src={imgUrl} alt="contributors avatar" className={styles.contributorsImage} />
                  <div className={styles.contributorsInfo}>
                    <Link to={`/${username}`} className={styles.contributorsLink}>{username}</Link>
                    <span className={styles.contributorsCommitCount}>{commitsCount} commits</span>
                  </div>
                </div>
                <div className={styles.contributorsChart}>
                  <ResponsiveContainer width="100%" height={130}>
                    <AreaChart data={data}>
                      <XAxis dataKey="date" />
                      <YAxis axisLine={false} width={13} dataKey="value" />
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
  createdRepoDate: PropTypes.string.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id: repoId, createdAt: createdRepoDate }
    }
  }
}) => ({
  repoId,
  createdRepoDate
});

export default connect(mapStateToProps)(ContributorsInsights);
