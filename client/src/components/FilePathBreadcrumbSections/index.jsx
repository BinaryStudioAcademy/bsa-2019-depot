import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'semantic-ui-react';
import { fetchFileTree } from '../../routines/routines';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class FilePathBreadcrumbSections extends React.Component {
  getFolderContent = (e, index, array) => {
    const { fetchFileTree, owner, reponame, branch, history } = this.props;
    e.preventDefault();
    const pathToDir = `${array.slice(0, index + 1).join('/')}`;
    fetchFileTree({
      username: owner,
      reponame,
      branch,
      query: {
        pathToDir
      }
    });
    history.push(`/${owner}/${reponame}/tree/${branch}/${pathToDir}`);
  };

  handleClickDir = (index, array) => e => {
    this.getFolderContent(e, index, array);
  };

  render() {
    const { filepath } = this.props;
    return filepath.map((directory, index, array) => (
      <Fragment key={index}>
        <Breadcrumb.Section>
          <Link to="" onClick={this.handleClickDir(index, array)}>
            {directory}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
      </Fragment>
    ));
  }
}

FilePathBreadcrumbSections.propTypes = {
  owner: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  filepath: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchFileTree: PropTypes.func.isRequired,
  history: PropTypes.object
};

const mapDispatchToProps = {
  fetchFileTree
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(FilePathBreadcrumbSections));
