import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Segment } from 'semantic-ui-react';
import Octicon, { Clippy } from '@primer/octicons-react';
import styles from './styles.module.scss';
import { withRouter } from 'react-router-dom';
import CopyableTerminal from '../../components/CopyableTerminal';

function EmptyRepositoryTab(props) {
  const {
    match: {
      params: { username, reponame }
    }
  } = props;

  const url = `git@${window.location.host}:${username}/${reponame}.git`;

  const createRepoStr = [
    'echo "# test" >> README.md\n',
    'git init',
    'git add README.md',
    'git commit -m "first commit"',
    `git remote add origin ${url}`,
    'git push -u origin master'
  ];

  const pushRepoSrt = [`git remote add origin ${url}\n`, 'git push -u origin master'];

  const getString = stringsArray => {
    return stringsArray.reduce((result, str, i, array) => {
      return i < array.length - 1 ? `${result}${str}\n` : `${result}${str}`;
    });
  };

  function copyUrl() {
    navigator.clipboard.writeText(url);
  }

  return (
    <Segment basic>
      <div className={styles.box}>
        <section className={styles.boxSectionHeader}>
          <h3>Quick setup — if you’ve done this kind of thing before</h3>
          <div className={styles.urlGroup}>
            <Button className={[styles.protocolButton, styles.buttonUnshaded]} attached={true}>
              SSH
            </Button>
            <span className={styles.clipboardInput}>{url}</span>
            <Button
              className={[styles.protocolButton, styles.buttonUnshaded]}
              icon={<Octicon icon={Clippy} />}
              attached="right"
              onClick={copyUrl}
            />
          </div>
        </section>
        <section className={styles.boxSection}>
          <h3>…or create a new repository on the command line</h3>
          <CopyableTerminal str={getString(createRepoStr)} />
        </section>
        <section className={styles.boxSection}>
          <h3>…or push an existing repository from the command line</h3>
          <CopyableTerminal str={getString(pushRepoSrt)} />
        </section>
      </div>
      <p className={styles.protip}>
        <Icon name="idea" />
        ProTip! Use the URL for this page when adding Depot as a remote.
      </p>
    </Segment>
  );
}

EmptyRepositoryTab.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
      reponame: PropTypes.string.isRequired
    })
  })
};
export default withRouter(EmptyRepositoryTab);
