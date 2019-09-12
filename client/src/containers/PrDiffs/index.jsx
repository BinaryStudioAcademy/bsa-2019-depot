import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Dropdown, Icon } from 'semantic-ui-react';
import DiffList from '../../components/DiffList';
import parse from 'parse-diff';
import { updateReviewStatus } from '../../services/pullReviewersService';

import styles from './styles.module.scss';

const getExtension = filename => {
  const [, ext] = filename.split('.');
  return ext ? '.' + ext : 'No extension';
};

const PrDiffs = ({ diffs, currentUserId, currentPullId, isReviewer, reviewStatus, pullUrl }) => {
  const filepaths = diffs
    .split('diff --git')
    .filter(hunk => hunk)
    .map(hunk => hunk.slice(0, hunk.indexOf('\n')))
    .map(firstHunkLine => firstHunkLine.slice(firstHunkLine.indexOf('b/') + 2));

  const fileExtensions = new Set(filepaths.map(filename => getExtension(filename)));

  const files = parse(diffs);
  const fileChangeCounters = new Map(
    files.map(({ to, additions, deletions }) => [to, { newLines: additions, oldLines: deletions }])
  );

  const [filteredDiffs, setFilteredDiffs] = useState(diffs);
  const [extensionFilter, setExtensionFilter] = useState(fileExtensions);

  function blockPropagation(event) {
    event.stopPropagation();
  }

  function filterDiffs() {
    setFilteredDiffs(
      diffs
        .split('diff --git')
        .filter(hunk => {
          const firstHunkLine = hunk.slice(0, hunk.indexOf('\n'));
          const extension = getExtension(firstHunkLine.slice(firstHunkLine.indexOf('b/')));

          return extensionFilter.has(extension) || !hunk;
        })
        .join('diff --git')
    );
  }

  function updateFilters() {
    setExtensionFilter(extensionFilter);
    filterDiffs();
  }

  function onExtensionChange(event, data) {
    const { checked, value } = data;
    if (checked) {
      extensionFilter.add(value);
    } else {
      extensionFilter.delete(value);
    }
    updateFilters();
  }

  function onSelectAll() {
    [...fileExtensions].forEach(extension => extensionFilter.add(extension));
    updateFilters();
  }

  function onChangeReviewStatus(event, { value }) {
    updateReviewStatus({ userId: currentUserId, pullId: currentPullId, status: value }).then(() => {
      window.location.replace(pullUrl);
    });
  }

  function scrollToFile(event, data) {
    const { value: filename } = data;
    document.getElementById(filename).scrollIntoView();
  }

  return (
    <>
      <div className={styles.prDiffHeader}>
        <div className={styles.diffFilters}>
          <Dropdown text="File filter..." closeOnBlur={false}>
            <Dropdown.Menu>
              {[...fileExtensions].map(extension => (
                <Dropdown.Item onClick={blockPropagation} key={extension}>
                  <Checkbox
                    checked={extensionFilter.has(extension)}
                    onClick={blockPropagation}
                    onChange={onExtensionChange}
                    value={extension}
                    label={`${extension}`}
                  />
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={blockPropagation}>
                <span onClick={onSelectAll}>All {fileExtensions.size} file types selected</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown text="Jump to...">
            <Dropdown.Menu>
              {filepaths
                .filter(filepath => [...extensionFilter].some(extension => getExtension(filepath) === extension))
                .map((filepath, index) => (
                  <Dropdown.Item key={index} value={filepath} onClick={scrollToFile}>
                    <div className={styles.fileNameRow}>
                      <span className={styles.fileName}>{filepath.split('/').pop()}</span>
                      <div className={styles.fileChangesCounters}>
                        <span className={styles.newLines}>+{fileChangeCounters.get(filepath).newLines}</span>
                        <span className={styles.oldLines}>-{fileChangeCounters.get(filepath).oldLines}</span>
                      </div>
                    </div>
                    <div>{filepath}</div>
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {isReviewer && (
          <Dropdown text="Review changes" icon="dropdown" pointing="top right" className={styles.reviewChanges} button>
            <Dropdown.Menu>
              <Dropdown.Item value="APPROVED" onClick={onChangeReviewStatus}>
                {reviewStatus === 'APPROVED' && <Icon name="check" />}
                <div className={styles.statusDescription}>
                  <div className={styles.reviewChangesItemHeader}>Approve</div>
                  <div>Submit feedback approving these changes.</div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item value="CHANGES REQUESTED" onClick={onChangeReviewStatus}>
                {reviewStatus === 'CHANGES REQUESTED' && <Icon name="check" />}
                <div className={styles.statusDescription}>
                  <div className={styles.reviewChangesItemHeader}>Request changes</div>
                  <div>Submit feedback suggesting changes.</div>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <DiffList diffs={filteredDiffs} />
    </>
  );
};

PrDiffs.propTypes = {
  diffs: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  currentPullId: PropTypes.string.isRequired,
  isReviewer: PropTypes.bool.isRequired,
  reviewStatus: PropTypes.bool.isRequired,
  pullUrl: PropTypes.string.isRequired
};

export default PrDiffs;
