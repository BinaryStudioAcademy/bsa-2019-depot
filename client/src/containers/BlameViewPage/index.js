import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Breadcrumb, Button, Icon, Loader, Segment } from 'semantic-ui-react';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import { getFileBlame } from '../../services/branchesService';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './styles.module.scss';

class BlameViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blameData: {},
      loading: true
    };

    const { match, location } = this.props;
    this.filepath = location.pathname.replace(`${match.url}/`, '');

    //this.handleCopyPath = this.handleCopyPath.bind(this);
  }

  componentDidMount() {
    const { username, reponame, branch } = this.props.match.params;
    getFileBlame(username, reponame, branch, {
      filepath: this.filepath
    }).then(blameData =>
      this.setState({
        blameData,
        loading: false
      })
    );
  }


  render() {
    const { match, location } = this.props;

    const { username: owner, reponame, branch } = match.params;
    let filepathDirs, filename;
    filepathDirs = this.filepath.split('/').slice(0, -1); // Remove file name
    filename = location.pathname.split('/').pop();

    const { blameData, loading, deleting } = this.state;
    console.log(blameData);
    return loading || deleting ? (
      <Loader active inline="centered" />
    ) : (
      <>
        <div className={styles.filePathRow}>
          <Breadcrumb size="big" className={styles.filePath}>
            <Breadcrumb.Section>
              <Link to={`/${owner}/${reponame}/tree/${branch}`}>{reponame}</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <FilePathBreadcrumbSections owner={owner} reponame={reponame} branch={branch} filepath={filepathDirs} />
            <Breadcrumb.Section>{filename}</Breadcrumb.Section>
          </Breadcrumb>
          <Button compact size="small" className={styles.copyButton} onClick={this.handleCopyPath}>
            Copy path
          </Button>
        </div>
        <Segment.Group className={styles.fileViewContainer}>
          <Segment className={styles.fileViewHeader}>
            <div className={styles.fileControls}>
              <Button compact size="small" className={styles.copyButton} >
                  Normal View
              </Button>
            </div>
          </Segment>
          <Segment >
            { blameData.map( blameObj => (
              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <p>{blameObj.message}</p>
                    <p>{blameObj.date}</p>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <p>{blameObj.line}</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ))
            }
          </Segment>
        </Segment.Group>
      </>
    );
  }
}

BlameViewPage.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.exact({
    key: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    state: PropTypes.array
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, email }
  }
}) => ({
  username,
  email
});

export default connect(mapStateToProps)(BlameViewPage);
