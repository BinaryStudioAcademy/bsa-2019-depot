import React from 'react';
import { Container, Divider, Input } from 'semantic-ui-react';

import styles from './styles.module.scss';

class CollaboratorsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: []
    };
  }

  componentDidMount() {}

  render() {
    const { collaborators } = this.state;
    return (
      <Container>
        <div className={styles.collaborators_container}>
          <div className={styles.collaborators_header}>
            <span>
              <b>Collaborators</b>
            </span>
            <span>Push access to repository</span>
          </div>
          <Divider className={styles.divide} />

          <div className={styles.collaborators_list}>
            {collaborators ? (
              <ul></ul>
            ) : (
              <p>This repository doesn’t have any collaborators yet. Use the form below to add a collaborator.</p>
            )}
          </div>

          <Divider className={styles.divide} />
          <div className={styles.collaborators_search_container}>
            <span>
              <b>Search collaborator by name</b>
            </span>
            <Input size="mini" fluid label="Add collaborator" labelPosition="right" />
          </div>
        </div>
      </Container>
    );
  }
}

export default CollaboratorsPage;
