import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Icon, Divider } from 'semantic-ui-react';
import Octicon, { Clippy } from '@primer/octicons-react';
import styles from './styles.module.scss';
import { Link, withRouter } from 'react-router-dom';
import CopyableTerminal from '../../components/CopyableTerminal';

function EmptyRepositoryTab(props) {
  const { match: { params: { username, reponame } } } = props;
  const [protocol, setProtocol] = useState('HTTPS');

  const getUrl = ({protocol, username, reponame}) => {
    return protocol === 'HTTPS'
      ? `https://${window.location.host}/${username}/${reponame}.git`
      : `git@${window.location.host}:${username}/${reponame}.git`;
  };

  const url = getUrl({protocol, username, reponame});

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

  function setHttp() {
    setProtocol('HTTPS');
  }

  function setSsh() {
    setProtocol('SSH');
  }


  return (
    <Container>
      <Divider hidden />
      <div className={styles.box}>
        <section className={styles.boxSectionHeader}>
          <h2>Quick setup — if you’ve done this kind of thing before</h2>
          <div className={styles.urlGroup}>
            <Button.Group>
              <Button active={protocol === 'HTTPS'} onClick={setHttp}>
                HTTPS
              </Button>
              <Button active={protocol === 'SSH'} onClick={setSsh}>
                SSH
              </Button>
            </Button.Group>
            <span className={styles.clipboardInput}>{url}</span>
            <Button icon={<Octicon icon={Clippy} />} onClick={copyUrl}></Button>
          </div>
          <p>
            Get started
            {<Link to="/"> creating a new file</Link>} by or
            {<Link to="/"> uploading an existing file</Link>}. We recommend every repository include a{<Link to="/"> README</Link>},
            {<Link to="/"> LICENSE</Link>}, and
            {<Link to="/"> .gitignore</Link>}.
          </p>
        </section>
        <section className={styles.boxSection}>
          <h2>…or create a new repository on the command line</h2>
          <CopyableTerminal str={getString(createRepoStr)} />
        </section>
        <section className={styles.boxSection}>
          <h2>…or push an existing repository from the command line</h2>
          <CopyableTerminal str={getString(pushRepoSrt)} />
        </section>
        <section className={styles.boxSection}>
          <h2>…or import code from another repository</h2>
          <p>You can initialize this repository with code from a Subversion, Mercurial, or TFS project.</p>
          <Button as="a">Import code</Button>
        </section>
      </div>
      <p className={styles.protip}>
        <Icon name="idea" />
        ProTip! Use the URL for this page when adding GitHub as a remote.
      </p>
    </Container>
  );
}

EmptyRepositoryTab.propTypes = {
  match: {
    params: {
      username: PropTypes.string.isRequired,
      reponame: PropTypes.string.isRequired
    }
  }
};
export default withRouter(EmptyRepositoryTab);
