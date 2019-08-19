import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { Star } from '@primer/octicons-react';
import { LineChart, Line } from 'recharts';
import StarLink from '../../components/StarLink';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

class RepositoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.starClickHandler = this.starClickHandler.bind(this);
  }

  starClickHandler() {
    const repositoryId = this.props.repo.id;
    this.props.onStar({ repositoryId });
  }

  render() {
    //Mock
    const { repo: { name }, username } = this.props;
    const starsCount = Number(this.props.repo.starsCount);
    const data = [
      { name: 'commit1', uv: 4000, commitDate: 0, amt: 2400 },
      { name: 'commit2', uv: 3000, commitDate: 0, amt: 2210 },
      { name: 'commit3', uv: 2000, commitDate: 0, amt: 2290 },
      { name: 'commit4', uv: 2780, commitDate: 0, amt: 2000 },
      { name: 'commit5', uv: 1890, commitDate: 0, amt: 2181 },
      { name: 'commit6', uv: 2390, commitDate: 0, amt: 2500 },
      { name: 'commit7', uv: 3490, commitDate: 3800, amt: 2100 },
      { name: 'commit8', uv: 3490, commitDate: 0, amt: 2100 }
    ];


    return (
      <div className={styles.repo_item}>
        <div className={styles.repo_item_left}>
          <div>
            <Link to={`${username}/${name}`} className={styles.repo_name}>
              {name}
            </Link>
          </div>
          <div className="repo-info">
            <span className={styles.repo_info_item}>
              <span className={styles.repo_item_lang}>
                <span></span>JavaScript
              </span>
            </span>
            {starsCount ? (
              <span className={styles.repo_info_item}>
                <StarLink starsCount={starsCount} />
              </span>
            ) : null}
            <span className={styles.repo_info_item}>
              <span className={styles.repo_item_updated}>Updated 11 days ago</span>
            </span>
          </div>
        </div>
        <div className={styles.repo_item_right}>
          <div>
            <button className={styles.repo_item_stars} onClick={this.starClickHandler}>
              <Octicon className={styles.star_icon} icon={Star} />
              Star
            </button>
          </div>
          <LineChart width={155} height={25} data={data}>
            <Line type="monotone" dataKey="commitDate" stroke="#D7ECAD" strokeWidth={2} dot={null} />
          </LineChart>
        </div>
      </div>
    );
  }
}

RepositoryItem.defaultProps = {
  data: []
};

RepositoryItem.propTypes = {
  repo: PropTypes.string,
  username: PropTypes.string.isRequired
};

export default RepositoryItem;
