import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { Star } from '@primer/octicons-react';
import { LineChart, Line } from 'recharts';
import StarLink from '../../components/StarLink';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { getCommits } from '../../services/commitsService';
import { checkIfEmpty } from '../../services/repositoryService';
import { getBranches } from '../../services/branchesService';
import moment from 'moment';

import styles from './styles.module.scss';

class RepositoryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.repo };

    this.starClickHandler = this.starClickHandler.bind(this);
  }

  async componentDidMount() {
    const {
      repo: { id: repoId, name, createdAt },
      match: {
        params: { username }
      }
    } = this.props;

    const repoCreated = moment(createdAt).fromNow();
    this.setState({ updatedAt: repoCreated });

    await this.checkIfEmpty(username, name);

    const { isEmpty } = this.state;

    if (!isEmpty) {
      try {
        await this.getRepoBranches(repoId);
        const { repoBranches } = this.state;
        let allRepoCommits = [];
        repoBranches.forEach(async branch => {
          const allBranchCommits = this.getRepoCommits(repoId, branch.name);
          allRepoCommits.push(allBranchCommits);
        });
        Promise.all(allRepoCommits).then(data => {
          const allRepoCommitsSorted = data.flat().sort((a, b) => new Date(b.date) - new Date(a.date));
          const lastCommitDate = moment(allRepoCommitsSorted[0].date).fromNow();
          this.setState({ repoCommits: allRepoCommitsSorted, updatedAt: lastCommitDate });
          const { repoCommits } = this.state;
          this.groupCommitsByDay(repoCommits);
        });
      } catch (error) {
        return error;
      }
    }
  }

  async checkIfEmpty(username, reponame) {
    const data = await checkIfEmpty({ owner: username, reponame });
    this.setState({ isEmpty: data.isEmpty });
  }

  async getRepoBranches(repoId) {
    const branches = await getBranches(repoId);
    this.setState({ repoBranches: branches });
  }

  getRepoCommits(repoId, branchName) {
    return getCommits(repoId, branchName);
  }

  starClickHandler() {
    const { onStar } = this.props;
    const isStar = !this.state.isStar;
    const starsCount = isStar ? Number(this.state.starsCount) + 1 : Number(this.state.starsCount) - 1;

    this.setState({
      ...this.state,
      isStar,
      starsCount
    });

    onStar({ ...this.state, isStar, starsCount });
  }

  groupCommitsByDay(commits) {
    //transform server data format to format for recharts, count commits per 1 day
    const countOfCommitsByDate = commits.reduce((acc, commit) => {
      let i = acc.findIndex(x => x.day === moment(commit.date.split('T')[0]).dayOfYear());
      return (
        i === -1 ? acc.push({ day: moment(commit.date.split('T')[0]).dayOfYear(), commits: 1 }) : acc[i].commits++, acc
      );
    }, []);
    //days from year's start
    const period = moment().diff(moment().startOf('year'), 'days') + 1;
    const commitsPerYear = [];
    let index = 0;
    //from start of year to now
    for (let dayOfYear = 1; dayOfYear <= period; dayOfYear++) {
      if (countOfCommitsByDate.some(elem => elem.day === dayOfYear)) {
        commitsPerYear.push({ day: dayOfYear, commits: countOfCommitsByDate[index].commits });
        index += 1;
      } else {
        commitsPerYear.push({ day: dayOfYear, commits: 0 });
      }
    }
    this.setState({ commitsPerYear });
  }

  getRepoLink({ username, name, type }) {
    return type === 'stars' ? (
      <Link to={`${username}/${name}`} className={styles.repo_name}>
        <span className={styles.repo_owner}>{username}</span>&nbsp;/&nbsp;{name}
      </Link>
    ) : (
      <Link to={`${username}/${name}`} className={styles.repo_name}>
        {name}
      </Link>
    );
  }

  render() {
    const {
      repo: { name, isStar, isPublic },
      username,
      type
    } = this.props;
    const { updatedAt, isEmpty, commitsPerYear } = this.state;
    const starsCount = Number(this.props.repo.starsCount);
    const repoType = isPublic ? '' : 'Private';

    return (
      <div className={styles.repo_item}>
        <div className={styles.repo_item_left}>
          <h3>
            {this.getRepoLink({ username, name, type })}
            {!isPublic && <span className={styles.repoTypeLabel}>{repoType}</span>}
          </h3>
          <div className="repo-info">
            <span className={styles.repo_info_item}>
              <span className={styles.repo_item_lang}>
                <span></span>JavaScript
              </span>
            </span>
            {starsCount ? (
              <span className={styles.repo_info_item}>
                <StarLink href={`${username}/${name}/stargazers`} starsCount={starsCount} />
              </span>
            ) : null}
            <span className={styles.repo_info_item}>
              <span className={styles.repo_item_updated}>{`Updated ${updatedAt}`}</span>
            </span>
          </div>
        </div>
        <div className={styles.repo_item_right}>
          <div>
            <Button compact className={styles.repo_item_stars} onClick={this.starClickHandler}>
              <Octicon className={styles.star_icon} icon={Star} />
              {isStar ? 'Unstar' : 'Star'}
            </Button>
          </div>
          {!isEmpty && (
            <LineChart width={155} height={25} data={commitsPerYear}>
              <Line type="monotone" dataKey="commits" stroke="#D7ECAD" strokeWidth={2} dot={null} />
            </LineChart>
          )}
        </div>
      </div>
    );
  }
}

RepositoryItem.propTypes = {
  repo: PropTypes.object,
  username: PropTypes.string,
  type: PropTypes.string,
  onStar: PropTypes.func.isRequired,
  match: PropTypes.object
};

export default withRouter(RepositoryItem);
