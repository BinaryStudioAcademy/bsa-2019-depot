import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Label, Icon, Container } from 'semantic-ui-react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';

import IssuePrHeader from '../../components/IssuePrHeader';
import PrCommits from '../PrCommits';

import styles from './styles.module.scss';

class PullView extends React.Component {
  onPullUpdateTitle = () => {};
  isOwnPull = () => {
    return true;
  };

  getStatusColor = status => {
    return 'green';
  };

  getStatusText = status => {
    return 'Opened';
  };
  render() {
    const {
      match,
      location: { pathname }
    } = this.props;

    const currentPull = {
      title: 'test pr',
      number: '1',
      status: 'OPEN',
      user: {
        username: 'user0'
      }
    };
    const pullComments = [];

    const status = this.getStatusText();

    const baseUrl = match.url;
    const activePage = pathname.split('/')[3];
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

    return (
      <div>
        <IssuePrHeader
          title={currentPull.title}
          number={+currentPull.number}
          canEdit={this.isOwnPull()}
          onSubmit={this.onPullUpdateTitle}
          isIssue={false}
        />
        <div>
          <Label color={this.getStatusColor()} className={styles.pull_label}>
            <Icon name="exclamation circle" /> {status}
          </Label>
          <span className={styles.comment_author_name}>
            {`${currentPull.user.username} `}
            <span>{`${status.toLowerCase()} this pull-request ${moment(currentPull.createdAt).fromNow()} · ${
              pullComments.length
            } comments`}</span>
          </span>
        </div>
        <div className="ui top attached tabular menu">
          <div className={`${activeTab === 'conversation' && 'active'} item`}>
            <Link to={baseUrl}>
              Conversation <Label circular>{pullComments.length}</Label>
            </Link>
          </div>
          <div className={`${activeTab === 'commits' && 'active'} item`}>
            <Link to={`${baseUrl}/commits`}>
              Commits<Label circular>{0}</Label>
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
  location: PropTypes.object
};

export default withRouter(PullView);
