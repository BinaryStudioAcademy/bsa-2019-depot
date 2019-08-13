import React from 'react';
import EmptyRepositoryPage from '../../containers/EmptyRepositoryPage';
import { checkIfEmpty } from '../../services/repositoryService';
import Spinner from '../../components/Spinner';


class RepositoryRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async getData() {
    const { isEmpty } = await checkIfEmpty({owner: 'Nick', repository: 'aa'});
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
      return (<Spinner />);
    }

    return (
      isEmpty
        ? (
          <EmptyRepositoryPage />
        )
        : (
          <div>Repository page is here</div>
        )
    );
  }
};

export default RepositoryRoute;
