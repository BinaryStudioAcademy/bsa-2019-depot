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

    let blamesRaws;
    let nextCommit;
    let isMultiRawCommit = false;
    if (!loading) {
      blamesRaws = blameData.map( (blameObj, i) => {

        try {
          nextCommit = blameData[i+1].commitId;
        } catch (e) {

        }

        if (blameObj.commitId !== nextCommit && isMultiRawCommit !== true) {
          isMultiRawCommit = false;
          return (
            <>
            <Grid className={styles.blameGrid} stretched={true}>
              <Grid.Row className={styles.blameRow} stretched={true}>
                <Grid.Column width={8} className={styles.blameMain} >
                  <div className={styles.blame}>
                    <div className={styles.blameData}>
                      <div className={styles.blameAvatar}>
                        <Image src={getUserImgLink(blameObj.imgUrl)} avatar />
                      </div>
                      <div className={styles.blameMessage}>
                        <p>{ blameObj.message.length > 55 ? ((blameObj.message.slice(0, 55) + '...').replace(/\s+(?=\...)/, '')) : blameObj.message}</p>
                      </div>
                    </div>
                    <div className={styles.blameDate}>
                      <p>{moment(blameObj.date).fromNow()}</p>
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column width={8} className={styles.blobMain} stretched={true}>
                  <div className={styles.blob}>
                    <div className={styles.blobLineNumber}>
                      {i}
                    </div>
                    <div className={styles.blobLineData}>
                      <p>{blameObj.line}</p>
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid >
              <div className={styles.blameDivider}></div>
            </Grid>
          </>
          );
        }
        if (blameObj.commitId === nextCommit && isMultiRawCommit === true) {

          return (
            <>
              <Grid className={styles.blameGrid} stretched={true}>
                <Grid.Row className={styles.blameRow} stretched={true}>
                  <Grid.Column width={8} className={styles.blameMain} >
                    <div className={styles.blame}>
                      <div className={styles.blameData}>
                        <div className={styles.blameAvatar}>
                        </div>
                        <div className={styles.blameMessage}>
                        </div>
                      </div>
                      <div className={styles.blameDate}>
                      </div>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8} className={styles.blobMain} stretched={true}>
                    <div className={styles.blob}>
                      <div className={styles.blobLineNumber}>
                        {i}
                      </div>
                      <div className={styles.blobLineData}>
                        <p>{blameObj.line}</p>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          );
        }

        if (blameObj.commitId !== nextCommit && isMultiRawCommit === true) {
          isMultiRawCommit = false;
          return (
            <>
              <Grid className={styles.blameGrid} stretched={true}>
                <Grid.Row className={styles.blameRow} stretched={true}>
                  <Grid.Column width={8} className={styles.blameMain} >
                    <div className={styles.blame}>
                      <div className={styles.blameData}>
                        <div className={styles.blameAvatar}>
                        </div>
                        <div className={styles.blameMessage}>
                        </div>
                      </div>
                      <div className={styles.blameDate}>
                      </div>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8} className={styles.blobMain} stretched={true}>
                    <div className={styles.blob}>
                      <div className={styles.blobLineNumber}>
                        {i}
                      </div>
                      <div className={styles.blobLineData}>
                        <p>{blameObj.line}</p>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid >
                <div className={styles.blameDivider}></div>
              </Grid>
            </>
          );
        }

        if (blameObj.commitId === nextCommit && isMultiRawCommit !== true) {
          isMultiRawCommit = true;
          return (
            <>
              <Grid className={styles.blameGrid} stretched={true}>
                <Grid.Row className={styles.blameRow} stretched={true}>
                  <Grid.Column width={8} className={styles.blameMain} >
                    <div className={styles.blame}>
                      <div className={styles.blameData}>
                        <div className={styles.blameAvatar}>
                          <Image src={getUserImgLink(blameObj.imgUrl)} avatar />
                        </div>
                        <div className={styles.blameMessage}>
                          <p>{ blameObj.message.length > 55 ? ((blameObj.message.slice(0, 55) + '...').replace(/\s+(?=\...)/, '')) : blameObj.message}</p>
                        </div>
                      </div>
                      <div className={styles.blameDate}>
                        <p>{moment(blameObj.date).fromNow()}</p>
                      </div>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={8} className={styles.blobMain} stretched={true}>
                    <div className={styles.blob}>
                      <div className={styles.blobLineNumber}>
                        {i}
                      </div>
                      <div className={styles.blobLineData}>
                        <p>{blameObj.line}</p>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          );
        }
        return nextCommit;
      });
    }



    // const articleElements = articles.map((article) => <li key={article.id}>
    //   <NavLink activeStyle={{color: 'red'}} to={`/articles/${article.id}`}>{article.title}</NavLink>
    // </li>)

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




          <Segment className={styles.blameSegment}>
            {blamesRaws}
            {/*{ blameData.map( (blameObj, i) => (*/}
            {/*  <>*/}
            {/*  <Grid className={styles.blameGrid} stretched={true}>*/}
            {/*    <Grid.Row className={styles.blameRow} stretched={true}>*/}
            {/*      <Grid.Column width={8} className={styles.blameMain} >*/}
            {/*        <div className={styles.blame}>*/}
            {/*          <div className={styles.blameData}>*/}
            {/*            <div className={styles.blameAvatar}>*/}
            {/*              <Image src={getUserImgLink(blameObj.imgUrl)} avatar />*/}
            {/*            </div>*/}
            {/*            <div className={styles.blameMessage}>*/}
            {/*              <p>{blameObj.message}</p>*/}
            {/*            </div>*/}
            {/*          </div>*/}
            {/*          <div className={styles.blameDate}>*/}
            {/*            <p>{moment(blameObj.date).fromNow()}</p>*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      </Grid.Column>*/}
            {/*      <Grid.Column width={8} className={styles.blobMain} stretched={true}>*/}
            {/*        <div className={styles.blob}>*/}
            {/*          <div className={styles.blobLineNumber}>*/}
            {/*            {i}*/}
            {/*          </div>*/}
            {/*          <div className={styles.blobLineData}>*/}
            {/*            <p>{blameObj.line}</p>*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      </Grid.Column>*/}
            {/*    </Grid.Row>*/}
            {/*  </Grid>*/}
            {/*    <Grid >*/}
            {/*      <div className={styles.blameDivider}></div>*/}
            {/*    </Grid>*/}
            {/*  </>*/}

            {/*))*/}
            {/*}*/}

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
