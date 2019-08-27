import React from 'react';
import { connect } from 'react-redux';
import EmptyRepositoryTab from '../../containers/EmptyRepositoryTab';
import PropTypes from 'prop-types';
import { CodeTab } from '../../scenes';
import { checkIfEmpty } from '../../services/repositoryService';
import { fetchCurrentRepo } from '../../routines/routines';
import Spinner from '../../components/Spinner';

class RepositoryTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { username, reponame }
      }
    } = this.props;
    const { isEmpty } = await checkIfEmpty({ owner: username, reponame });
    this.setState({
      ...this.state,
      isEmpty,
      isLoading: false
    });
  }

  render() {
    // history={history} username={username} reponame={reponame} branch={branch || null}
    const { isLoading, isEmpty } = this.state;
    if (isLoading) {
      return <Spinner />;
    }

    return isEmpty ? (
      <EmptyRepositoryTab />
    ) : (
      <CodeTab />
    );
  }
}

RepositoryTab.propTypes = {
  history: PropTypes.any,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
      reponame: PropTypes.string.isRequired,
      branch: PropTypes.string
    })
  })
};

export default RepositoryTab;
