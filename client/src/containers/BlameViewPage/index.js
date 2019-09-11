import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Breadcrumb, Button, Image, Loader, Segment } from 'semantic-ui-react';
import FilePathBreadcrumbSections from '../../components/FilePathBreadcrumbSections';
import { getFileBlame } from '../../services/branchesService';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './styles.module.scss';
import { getUserImgLink } from '../../helpers/imageHelper';

class BlameViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      blameData: {},
      loading: true
    };

    const { match, location } = this.props;
    this.filepath = location.pathname.replace(`${match.url}/`, '');

    this.onNormalView = this.onNormalView.bind(this);
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

  onNormalView() {
    const { history, location } = this.props;
    history.push(location.pathname.replace('/blame', '/blob'));
  }

  blameRaw(blameObj, i) {
    return (
      <Grid className={styles.blameGrid} stretched={true}>
        <Grid.Row className={styles.blameRow} stretched={true}>
          <Grid.Column width={4} className={styles.blameMain}>
            <div className={styles.blame}>
              <div className={styles.blameData}>
                <div className={styles.blameAvatar}>
                  <Image src={getUserImgLink(blameObj.imgUrl)} avatar />
                </div>
                <div className={styles.blameMessage}>{blameObj.message}</div>
              </div>
              <div className={styles.blameDate}>{moment(blameObj.date).fromNow()}</div>
            </div>
          </Grid.Column>
          <Grid.Column className={styles.blobMain}>
            <div className={styles.blob}>
              <div className={styles.blobLineNumber}>{i}</div>
              <div className={styles.blobLineData}>
                <p>{blameObj.line}</p>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  blameMultiRaw(blameObj, i) {
    return (
      <Grid className={styles.blameGrid} stretched={true}>
        <Grid.Row className={styles.blameRow} stretched={true}>
          <Grid.Column width={4} className={styles.blameMain}>
            <div className={styles.blame}>
              <div className={styles.blameData}>
                <div className={styles.blameAvatar}></div>
                <div className={styles.blameMessage}></div>
              </div>
              <div className={styles.blameDate}></div>
            </div>
          </Grid.Column>
          <Grid.Column className={styles.blobMain}>
            <div className={styles.blob}>
              <div className={styles.blobLineNumber}>{i}</div>
              <div className={styles.blobLineData}>
                <p>{blameObj.line}</p>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    const { match, location } = this.props;
    const { username: owner, reponame, branch } = match.params;

    let filepathDirs, filename;
    filepathDirs = this.filepath.split('/').slice(0, -1); // Remove file name
    filename = location.pathname.split('/').pop();
    const { blameData, loading, deleting } = this.state;

    let blamesRaws;
    let nextCommit;
    let isMultiRawCommit = false;

    if (!loading) {
      blamesRaws = blameData.map((blameObj, i) => {
        try {
          nextCommit = blameData[i + 1].commitId;
        } catch (e) {}

        if (blameObj.commitId !== nextCommit && isMultiRawCommit !== true) {
          isMultiRawCommit = false;
          return (
            <>
              {this.blameRaw(blameObj, i)}
              <Grid>
                <div className={styles.blameDivider}></div>
              </Grid>
            </>
          );
        }

        if (blameObj.commitId === nextCommit && isMultiRawCommit === true) {
          return <>{this.blameMultiRaw(blameObj, i)}</>;
        }

        if (blameObj.commitId !== nextCommit && isMultiRawCommit === true) {
          isMultiRawCommit = false;
          return (
            <>
              {this.blameMultiRaw(blameObj, i)}
              <Grid>
                <div className={styles.blameDivider}></div>
              </Grid>
            </>
          );
        }

        if (blameObj.commitId === nextCommit && isMultiRawCommit !== true) {
          isMultiRawCommit = true;
          return <>{this.blameRaw(blameObj, i)}</>;
        }
        return nextCommit;
      });
    }

    return loading || deleting ? (
      <Loader active inline="centered" />
    ) : (
      <Segment basic>
        <div className={styles.filePathRow}>
          <Breadcrumb size="big" className={styles.filePath}>
            <Breadcrumb.Section>
              <Link to={`/${owner}/${reponame}/tree/${branch}`}>{reponame}</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <FilePathBreadcrumbSections owner={owner} reponame={reponame} branch={branch} filepath={filepathDirs} />
            <Breadcrumb.Section>{filename}</Breadcrumb.Section>
          </Breadcrumb>
          <div>
            <Button compact size="small" className={styles.copyButton} onClick={this.onNormalView}>
              Normal View
            </Button>
            <Button compact size="small" className={styles.copyButton} onClick={this.handleCopyPath}>
              Copy path
            </Button>
          </div>
        </div>
        <Segment.Group className={styles.fileViewContainer}>
          <Segment className={styles.fileViewHeader}>
            <div className={styles.fileMetaData}>
              <p>{blameData.length} lines</p>
            </div>
          </Segment>
          <Segment className={styles.blameSegment}>{blamesRaws}</Segment>
        </Segment.Group>
      </Segment>
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
