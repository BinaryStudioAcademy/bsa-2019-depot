import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Loader } from 'semantic-ui-react';
//import { getForksList } from '../../services/repositoryService';

import styles from './styles.module.scss';

class ForksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forks: [{ id: 1, name: 'aaaa' }, { id: 2, name: 'bbbb' }],
      loading: false //true
    };
  }

  //componentDidMount() {
  // this.getForksList();
  // }

  //getForksList() {
  //const { userId } = this.props;
  // getForksList(userId).then(forks => {
  //   this.setState({ forks, loading: false });
  // });
  //}

  render() {
    const { loading, forks } = this.state;

    return (
      <>
        <Header as="h2" dividing>
          <Header.Content>Forks</Header.Content>
        </Header>
        <div className={styles.section}>
          {loading ? (
            <Loader active />
          ) : (
            <ul className={styles.forksList}>
              {forks.map(({ id, name }) => (
                <li key={id}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  }
}

ForksPage.propTypes = {
  history: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId }
  }
}) => ({
  userId
});

export default connect(mapStateToProps)(ForksPage);
