import React from 'react';
import { Link } from 'react-router-dom';
import Octicon, { Star } from '@primer/octicons-react';
import { LineChart, Line } from 'recharts';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export class RepositoryItem extends React.Component {
    render() {
    //Mock
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
                        <Link to="" className={styles.repo_name}>
                            {this.props.repo}
                        </Link>
                    </div>
                    <div className="repo-info">
                        <p className={styles.repo_item_lang}>
                            <span></span>JavaScript
                        </p>
                        <p className={styles.repo_item_updated}>Updated 11 days ago</p>
                    </div>
                </div>
                <div className={styles.repo_item_right}>
                    <div>
                        <button className={styles.repo_item_stars}>
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
    data: PropTypes.array.isRequired
};

RepositoryItem.propTypes = {
    repo: PropTypes.string
};
