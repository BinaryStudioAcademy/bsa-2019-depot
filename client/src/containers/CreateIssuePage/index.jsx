import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createIssue, fetchCurrentRepo } from '../../routines/routines';
import { Container } from 'semantic-ui-react';
import CreateIssuePrForm from '../../components/CreateIssuePrForm';
import { getAllQuestionOnSO } from '../../services/issuesService';

import styles from './styles.module.scss';

class CreateIssuePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {
      repositoryId,
      fetchCurrentRepo,
      match: {
        params: { reponame, username }
      }
    } = this.props;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    }
    const filter = {
      key: 'K)aMbXa)izv27xUSCXUW8A((',
      intitle: 'How to fetch an API in reactJs',
      site: 'stackoverflow',
      pagesize: 50,
      tagged: 'reactjs',
      sort: 'activity',
      order: 'asc'
    };
    getAllQuestionOnSO(filter).then(question => this.setState({ question }));
  }

  onSubmit(title, body) {
    const {
      createIssue,
      repositoryId,
      userId,
      history,
      match: { url }
    } = this.props;

    createIssue({
      title,
      body,
      userId,
      repositoryId,
      isOpened: true
    });

    const newUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');
    history.push(newUrl);
  }

  render() {
    return (
      <Container className={styles.issueFormContainer}>
        <CreateIssuePrForm isIssues onSubmit={this.onSubmit} />
      </Container>
    );
  }
}

CreateIssuePage.propTypes = {
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string,
  issues: PropTypes.array.isRequired,
  repositoryId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  createIssue: PropTypes.func.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId, username }
  },
  issuesData: { issues },
  currentRepo: {
    repository: {
      currentRepoInfo: { id, name }
    }
  }
}) => ({
  userId,
  username,
  issues,
  reponame: name,
  repositoryId: id
});

const mapDispatchToProps = {
  createIssue,
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIssuePage);
