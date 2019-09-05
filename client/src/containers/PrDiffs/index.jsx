import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, Dropdown } from 'semantic-ui-react';
import { parseDiff } from 'react-diff-view';
import DiffList from '../../components/DiffList';
import parse from 'parse-diff';

import styles from './styles.module.scss';

const PrDiffs = ({ diffs }) => {
  const filepaths = diffs
    .split('diff --git')
    .filter(hunk => hunk)
    .map(hunk => hunk.slice(0, hunk.indexOf('\n')))
    .map(firstHunkLine => firstHunkLine.slice(firstHunkLine.indexOf('b/') + 2));

  const fileExtensions = new Set(
    filepaths
      .map(filename => filename.split('.').pop())
  );

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
          const extension = firstHunkLine
            .slice(firstHunkLine.indexOf('b/'))
            .split('.').pop();

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

  function scrollToFile(event, data) {
    const { value: filename } = data;
    document.getElementById(filename).scrollIntoView();
  }

  return (
    <>
      <div className={styles.prDiffHeader}>
        <div className={styles.diffFilters}>
          <Dropdown
            text="File filter..."
            closeOnBlur={false}
          >
            <Dropdown.Menu>
              {[...fileExtensions].map(extension => (
                <Dropdown.Item onClick={blockPropagation} key={extension}>
                  <Checkbox checked={extensionFilter.has(extension)} onClick={blockPropagation} onChange={onExtensionChange} value={extension} label={`.${extension}`}/>
                </Dropdown.Item>
              ))}
              <Dropdown.Item onClick={blockPropagation}>
                <span onClick={onSelectAll}>All {fileExtensions.size} file types selected</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            text="Jump to..."
          >
            <Dropdown.Menu>
              {filepaths
                .filter(filepath => [...extensionFilter].some(extension => filepath.endsWith(extension)))
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
        <Button primary>Review changes</Button>
      </div>
      <DiffList diffs={filteredDiffs}/>
    </>
  );
};

PrDiffs.propTypes = {
  diffs: PropTypes.string.isRequired
};

export default PrDiffs;
