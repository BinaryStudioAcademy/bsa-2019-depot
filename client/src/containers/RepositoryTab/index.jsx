import React from 'react';
import EmptyRepositoryTab from '../../containers/EmptyRepositoryTab';
import PropTypes from 'prop-types';
import { CodeTab } from '../../scenes';
import { checkIfEmpty } from '../../services/repositoryService';
import Spinner from '../../components/Spinner';

class RepositoryTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async getData() {
    const { username, reponame } = this.props.match.params;
    const { isEmpty } = await checkIfEmpty({ owner: username, reponame });
    this.setState({
      ...this.state,
      isEmpty,
      isLoading: false
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { isLoading, isEmpty } = this.state;
    if (isLoading) {
      return <Spinner />;
    }

    return isEmpty ? <EmptyRepositoryTab /> : <CodeTab />;
  }
}

RepositoryTab.propTypes = {
  match: {
    username: PropTypes.string.isRequired,
    reponame: PropTypes.string.isRequired
  }
};

export default RepositoryTab;
