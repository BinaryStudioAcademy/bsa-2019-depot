import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { Star } from '@primer/octicons-react';
import { LineChart, Line } from 'recharts';
import StarLink from '../../components/StarLink';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import styles from './styles.module.scss';

//Mock
const data = [
  { name: 'commit1', commitDate: 0 },
  { name: 'commit2', commitDate: 0 },
  { name: 'commit3', commitDate: 0 },
  { name: 'commit4', commitDate: 0 },
  { name: 'commit5', commitDate: 0 },
  { name: 'commit6', commitDate: 0 },
  { name: 'commit7', commitDate: 3800 },
  { name: 'commit8', commitDate: 0 }
];

class RepositoryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.repo };

    this.starClickHandler = this.starClickHandler.bind(this);
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
      repo: { name, isStar },
      username,
      type
    } = this.props;
    const starsCount = Number(this.props.repo.starsCount);

    return (
      <div className={styles.repo_item}>
        <div className={styles.repo_item_left}>
          <h3>{this.getRepoLink({ username, name, type })}</h3>
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
              <span className={styles.repo_item_updated}>Updated 11 days ago</span>
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
          {data && (
            <LineChart width={155} height={25} data={data}>
              <Line type="monotone" dataKey="commitDate" stroke="#D7ECAD" strokeWidth={2} dot={null} />
            </LineChart>
          )}
        </div>
      </div>
    );
  }
}

RepositoryItem.defaultProps = {
  data: []
};

RepositoryItem.propTypes = {
  repo: PropTypes.object,
  username: PropTypes.string,
  type: PropTypes.string,
  onStar: PropTypes.func.isRequired
};

export default RepositoryItem;
