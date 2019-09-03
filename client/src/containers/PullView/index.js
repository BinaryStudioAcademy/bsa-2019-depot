import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Label, Icon, Container, Loader } from 'semantic-ui-react';
import { Switch, Route, Link } from 'react-router-dom';

import IssuePrHeader from '../../components/IssuePrHeader';
import PrCommits from '../PrCommits';

import { getPullByNumber, getPullComments, getBranchDiffs, updatePull } from '../../services/pullsService';
// import { updatePullComment } from '../../services/pullCommentsService';
import { getWriteUserPermissions } from '../../helpers/checkPermissionsHelper';

import styles from './styles.module.scss';

class PullView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPull: {},
      commitsCount: 0,
      loading: true
    };
  }
  async componentDidMount() {
    const {
      match: {
        params: { username, reponame, number }
      },
      repositoryId,
      userId
    } = this.props;
    const currentPull = await getPullByNumber(username, reponame, number);
    const {
      fromBranch: { name: fromBranch },
      toBranch: { name: toBranch }
    } = currentPull;
    const { commits } = await getBranchDiffs(repositoryId, { fromBranch, toBranch });
    const { id } = currentPull;
    const pullComments = await getPullComments(id);
    const isAccessGranted = await getWriteUserPermissions(username, reponame, userId);
    this.setState({
      currentPull,
      commitsCount: commits.length,
      pullComments,
      isAccessGranted,
      loading: false
    });
    //this.initSocket();
  }

  onPullUpdateTitle = async (title) => {
    const { id, body } = this.state.currentPull;
    return await updatePull({ id, title, body });
  };

  isOwnPull = () => {
    const { userId } = this.props;
    const { userId: pullUserId } = this.state.currentPull;
    const { isAccessGranted } = this.state;
    return userId === pullUserId || isAccessGranted;
  };

  getStatusColor = status => {
    let color;
    switch (status) {
    case 'OPEN':
      color = 'green';
      break;
    case 'CLOSED':
      color = '#ED1A37';
      break;
    case 'MERGED':
      color = '#6f42c1';
      break;
    default:
      color = 'green';
    }
    return color;
  };

  getStatusText = commitsCount => {
    const {
      toBranch: { name: toBranch },
      fromBranch: { name: fromBranch },
      updatedAt,
      createdAt,
      prstatus: { name }
    } = this.state.currentPull;

    let statusText = '';
    switch (name) {
    case 'OPEN':
      statusText = `wants to merge ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        createdAt
      ).fromNow()}`;
      break;
    case 'CLOSED':
      statusText = `$wants to merge ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        updatedAt
      ).fromNow()}`;
      break;
    case 'MERGED':
      statusText = `$merged ${commitsCount} commit into ${toBranch} from ${fromBranch} · ${moment(
        updatedAt
      ).fromNow()}`;
      break;
    default:
      statusText = 'green';
    }
    return statusText;
  };

  render() {
    const {
      match,
      location: { pathname }
    } = this.props;

    const { currentPull, loading, commitsCount, pullComments } = this.state;
    const baseUrl = match.url;
    const activePage = pathname.split('/')[5];

    let activeTab;
    switch (activePage) {
    case 'conversation':
      activeTab = 'conversation';
      break;
    case 'commits':
      activeTab = 'commits';
      break;
    case 'files-changed':
      activeTab = 'files-changed';
      break;
    default:
      activeTab = 'conversation';
    }

    return !loading ? (
      <div>
        <IssuePrHeader
          title={currentPull.title}
          number={+currentPull.number}
          canEdit={this.isOwnPull()}
          onSubmit={this.onPullUpdateTitle}
          isIssue={false}
        />
        <div>
          <Label color={this.getStatusColor(currentPull.prstatus.name)} className={styles.pull_label}>
            <Icon name="exclamation circle" /> {currentPull.prstatus.name}
          </Label>
          <span className={styles.comment_author_name}>
            {`${currentPull.user.username} `}
            <span>{this.getStatusText(commitsCount)}</span>
          </span>
        </div>
        <div className="ui top attached tabular menu">
          <div className={`${activeTab === 'conversation' && 'active'} item`}>
            <Link to={baseUrl}>
              Conversation <Label circular>{pullComments.data.length}</Label>
            </Link>
          </div>
          <div className={`${activeTab === 'commits' && 'active'} item`}>
            <Link to={`${baseUrl}/commits`}>
              Commits<Label circular>{commitsCount}</Label>
            </Link>
          </div>
          <div className={`${activeTab === 'files-changed' && 'active'} item`}>
            <Link to={`${baseUrl}/files-changed`}>
              Files changed<Label circular>{0}</Label>
            </Link>
          </div>
        </div>
        <Container className={styles.contentContainer}>
          <Switch>
            <Route exact path={`${match.path}/commits`} component={PrCommits} />
            <Route exact path={`${match.path}/files-changed`} component={null} />
          </Switch>
        </Container>
      </div>
    ) : (
      <Loader active />
    );
  }
}

PullView.propTypes = {
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  location: PropTypes.object,
  repositoryId: PropTypes.string,
  userId: PropTypes.string
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id }
    }
  },
  profile: {
    currentUser: { id: userId }
  }
}) => ({
  repositoryId: id,
  userId
});

export default connect(mapStateToProps)(PullView);
