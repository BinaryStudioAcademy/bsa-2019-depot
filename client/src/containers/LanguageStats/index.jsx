import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLanguageStats } from '../../services/statsService';

import styles from './styles.module.scss';

class LanguageStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      languageStats: [],
      displayLangs: false
    };

    this.toggleDisplayLangs = this.toggleDisplayLangs.bind(this);
  }

  componentDidMount() {
    const { repoId, branch } = this.props;

    if (!branch || !repoId) {
      return;
    }

    getLanguageStats(repoId, branch).then(languageStats => {
      this.setState({ languageStats, loading: false });
    });
  }

  toggleDisplayLangs() {
    this.setState(prevState => ({ displayLangs: !prevState.displayLangs }));
  }

  render() {
    const { displayLangs, languageStats } = this.state;

    return (
      <>
        <div className={styles.languageStatColors} onClick={this.toggleDisplayLangs}>
          {languageStats.map(({ percentage, language: { color } }) => (
            <div
              key={color}
              className={styles.languageColorLine}
              style={{ backgroundColor: color, width: `${percentage}%` }}
            />
          ))}
        </div>
        {displayLangs && (
          <div className={styles.languageStats}>
            {languageStats.map(({ percentage, language: { name, color } }) => (
              <div key={name} className={styles.languageLegend}>
                <span className={styles.languageColorDot} style={{ backgroundColor: color }} />
                <span className={styles.languageName}>{name}</span>
                <span>{percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}

LanguageStats.propTypes = {
  branch: PropTypes.string.isRequired,
  repoId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id }
    }
  }
}) => ({
  repoId: id
});

export default connect(mapStateToProps)(LanguageStats);
