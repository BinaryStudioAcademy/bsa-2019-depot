import React from 'react';
import EmptyRepositoryTab from '../../containers/EmptyRepositoryTab';
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
    const { isEmpty } = await checkIfEmpty({ owner: 'TheSubliminal', repository: 'depot-test' });
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

export default RepositoryTab;
