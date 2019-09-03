import React from 'react';
import PropTypes from 'prop-types';
import { parseDiff, Diff, Hunk, Decoration } from 'react-diff-view';

import './styles.module.scss';

const DiffList = ({ diffs }) => {
  let files = [];

  if (diffs) {
    files = parseDiff(diffs);
  }

  const renderHunk = (newPath, hunk) => [
    <Decoration key={hunk.content} className="diff-filename">
      <span id={newPath}>{newPath}</span>
    </Decoration>,
    <Decoration key={`decoration-${hunk.content}`}>{hunk.content}</Decoration>,
    <Hunk key={hunk.content + Math.random()} hunk={hunk} />
  ];

  return files.map(({ newPath, oldRevision, newRevision, type, hunks }) =>
    type === 'new' ? (
      <div key={newPath} className="diff-content">
        <p className="diff-filename">{`new empty file ${newPath}`}</p>
      </div>
    ) : (
      <Diff
        key={`${oldRevision}-${newRevision}`}
        viewType="unified"
        diffType={type}
        hunks={hunks}
        className="diff-content"
      >
        {hunks => hunks.flatMap(h => renderHunk(newPath, h))}
      </Diff>
    )
  );
};

DiffList.propTypes = {
  diffs: PropTypes.string.isRequired
};

export default DiffList;
