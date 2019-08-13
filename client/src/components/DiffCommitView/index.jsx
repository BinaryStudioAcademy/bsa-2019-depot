import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';
import { fetchDiffs } from '../../routines/routines';

import './styles.module.scss';

class DiffCommitView extends Component {
  componentDidMount() {
    this.props.fetchDiffs({
      // Mock
      owner: this.props.username,
      repoName: 'new-repo',
      hash: this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1)
    });
  }

  render() {
    const { diffsData } = this.props;
    let files = [];

    if (diffsData.diffs) {
      files = parseDiff(diffsData.diffs);
    }

    const error = diffsData.error ? <div>{diffsData.error}</div> : null;

    const renderHunk = (newPath, hunk) => [
      <Decoration key={hunk.content} className="diff-filename">
        {newPath}
      </Decoration>,
      <Decoration key={'decoration-' + hunk.content}>{hunk.content}</Decoration>,
      <Hunk key={hunk.content + Math.random()} hunk={hunk} />
    ];
    const renderFile = ({ newPath, oldRevision, newRevision, type, hunks }) =>
      type === 'new' ? (
        <div key={newPath} className="diff-content">
          <p className="diff-filename">{`new empty file ${newPath}`}</p>
        </div>
      ) : (
        <Diff
          key={oldRevision + '-' + newRevision}
          viewType="unified"
          diffType={type}
          hunks={hunks}
          className="diff-content"
        >
          {hunks => hunks.flatMap(h => renderHunk(newPath, h))}
        </Diff>
      );

    return (
      <div>
        {error}
        {files.map(renderFile)}
      </div>
    );
  }
}

DiffCommitView.propTypes = {
  diffsData: PropTypes.exact({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    diffs: PropTypes.string
  }).isRequired,
  /*repoName: PropTypes.string.isRequired,*/
  fetchDiffs: PropTypes.func.isRequired,
  location: PropTypes.object,
  username: PropTypes.string
};

const mapStateToProps = ({
  diffsData,
  profile: {
    currentUser: { username }
  } /*, repoName*/
}) => ({
  diffsData,
  username /*,
    repoName*/
});

const mapDispatchToProps = {
  fetchDiffs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiffCommitView);
