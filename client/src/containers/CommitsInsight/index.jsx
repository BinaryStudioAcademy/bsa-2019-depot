import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Loader, Divider, Icon, Header, Container } from 'semantic-ui-react';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Line } from 'recharts';
import { getCommitActivity } from '../../services/repositoryService';

import './styles.module.scss';

class CommitsInsight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repositoryId: '',
      loading: true,
      byPeriods: [],
      byDaysOfWeek: [],
      byDaysOfWeekMax: 0,
      byPeriodsMax: 0
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { id: repositoryId } = await getRepositoryByOwnerAndName({ username, reponame });

    const { byPeriods, byDaysOfWeek } = await getCommitActivity(repositoryId);
    const byDaysOfWeekMax = byDaysOfWeek && byDaysOfWeek.reduce((max, { value }) => (value > max ? value : max), 0);
    const byPeriodsMax = byPeriods && byPeriods.reduce((max, { value }) => (value > max ? value : max), 0);
    await this.setState({ repositoryId, loading: false, byPeriods, byDaysOfWeek, byDaysOfWeekMax, byPeriodsMax });
  }

  render() {
    const { loading, byPeriods, byDaysOfWeek, byDaysOfWeekMax, byPeriodsMax } = this.state;
    const {
      match: {
        params: { reponame }
      }
    } = this.props;

    return loading ? (
      <Loader active />
    ) : byPeriods && byDaysOfWeek ? (
      <Segment basic>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={byPeriods} margin={{ top: 5, right: 10, bottom: 0, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis
              scale="linear"
              axisLine={false}
              width={25}
              allowDecimals={false}
              {...(byPeriodsMax === 1 || byPeriodsMax === 2 ? { tickCount: byPeriodsMax } : {})}
            />
            <Bar dataKey="value" fill="#fb8532" />
          </BarChart>
        </ResponsiveContainer>
        <Divider hidden />
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={byDaysOfWeek} margin={{ top: 15, right: 10, bottom: 0, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis
              scale="linear"
              axisLine={false}
              width={25}
              allowDecimals={false}
              {...(byDaysOfWeekMax === 1 || byDaysOfWeekMax === 2 ? { tickCount: byDaysOfWeekMax } : {})}
            />
            <Line
              type="basic"
              dataKey="value"
              stroke="#28a745"
              strokeWidth={2}
              dot={{ stroke: '#28a745', strokeWidth: 2 }}
              label={{ position: 'top' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Segment>
    ) : (
      <Container textAlign="center">
        <Icon size="big" name="chart bar outline" />
        <Divider hidden />
        <Header as="h2">Welcome to the {reponame} graphs!</Header>
        <Segment basic>
          Once code is added to this repository, you’ll be able to see graphs for the commit timeline and forking
          activity.
        </Segment>
      </Container>
    );
  }
}

CommitsInsight.propTypes = {
  reponame: PropTypes.string,
  username: PropTypes.string,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default CommitsInsight;
