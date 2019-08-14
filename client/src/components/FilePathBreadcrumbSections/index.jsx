import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const FilePathBreadcrumbSections = ({ owner, reponame, branch, filepath }) => {
  return filepath.map((directory, index, array) => (
    <Fragment key={index}>
      <Breadcrumb.Section>
        <Link to={`/${owner}/${reponame}/tree/${branch}/${array.slice(0, index + 1).join('/')}`}>{directory}</Link>
      </Breadcrumb.Section>
      <Breadcrumb.Divider />
    </Fragment>
  ));
};

FilePathBreadcrumbSections.propTypes = {
  owner: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  filepath: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FilePathBreadcrumbSections;
