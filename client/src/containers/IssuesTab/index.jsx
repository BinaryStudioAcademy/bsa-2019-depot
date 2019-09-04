import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Segment } from 'semantic-ui-react';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import IssuesList from '../../components/IssuesList/index';

class IssuesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoId: '',
      loading: true
    };
  }

  async componentDidMount() {
    const {
      repositoryId,
      match: {
        params: { username, reponame }
      }
    } = this.props;
    if (!repositoryId) {
      const { id } = await getRepositoryByOwnerAndName({ username, reponame });
      this.setState({ repositoryId: id, loading: false });
    }
  }

  render() {
    const { loading, repositoryId } = this.state;

    return loading ? (
      <Loader active />
    ) : (
      <Segment basic>
        <IssuesList repositoryId={repositoryId} />
      </Segment>
    );
  }
}

IssuesTab.propTypes = {
  reponame: PropTypes.string,
  username: PropTypes.string,
  repositoryId: PropTypes.string,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default IssuesTab;
