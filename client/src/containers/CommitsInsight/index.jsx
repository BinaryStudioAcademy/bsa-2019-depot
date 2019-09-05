import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Loader, Divider, Icon, Header, Container } from 'semantic-ui-react';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Line } from 'recharts';

import './styles.module.scss';

class CommitsInsight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repositoryId: '',
      loading: true,
      byPeriods: [],
      byDaysOfWeek: []
    };
  }

  getCommitsChartData() {
    return {
      byPeriods: [
        { date: '08/06', value: 1 },
        { date: '08/07', value: 5 },
        { date: '08/08', value: 10 },
        { date: '08/09', value: 16 },
        { date: '08/10', value: 32 },
        { date: '08/11', value: 2 },
        { date: '08/12', value: 4 },
        { date: '08/13', value: 10 },
        { date: '08/14', value: 17 },
        { date: '08/15', value: 4 },
        { date: '08/16', value: 5 },
        { date: '08/17', value: 13 },
        { date: '08/18', value: 25 },
        { date: '08/19', value: 18 },
        { date: '08/20', value: 10 },
        { date: '08/21', value: 9 },
        { date: '08/22', value: 8 },
        { date: '08/23', value: 10 },
        { date: '08/24', value: 5 },
        { date: '08/25', value: 10 },
        { date: '08/26', value: 15 },
        { date: '08/27', value: 20 },
        { date: '08/28', value: 16 },
        { date: '08/29', value: 17 },
        { date: '08/30', value: 12 },
        { date: '08/31', value: 5 },
        { date: '09/01', value: 7 },
        { date: '09/01', value: 10 },
        { date: '09/02', value: 23 },
        { date: '09/03', value: 10 },
        { date: '09/04', value: 14 },
        { date: '09/05', value: 10 }
      ],
      byDaysOfWeek: [
        { day: 'Monday', value: 25 },
        { day: 'Tuesday', value: 45 },
        { day: 'Wednesday', value: 0 },
        { day: 'Thursday', value: 0 },
        { day: 'Friday', value: 35 },
        { day: 'Saturday', value: 25 },
        { day: 'Sunday', value: 15 }
      ]
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { id: repositoryId } = await getRepositoryByOwnerAndName({ username, reponame });

    const { byPeriods, byDaysOfWeek } = this.getCommitsChartData(repositoryId);
    await this.setState({ repositoryId, loading: false, byPeriods, byDaysOfWeek });
  }

  render() {
    const { loading, byPeriods, byDaysOfWeek } = this.state;
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
            <YAxis scale="linear" axisLine={false} width={25} />
            <Bar dataKey="value" fill="#fb8532" />
          </BarChart>
        </ResponsiveContainer>
        <Divider hidden />
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={byDaysOfWeek} margin={{ top: 15, right: 10, bottom: 0, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis scale="linear" axisLine={false} width={25} />
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
