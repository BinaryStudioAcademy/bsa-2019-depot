import React, { useState } from 'react';
import { Container, Button, Icon } from 'semantic-ui-react';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const url = 'https://github.com/NickNaumenko/test.git';

function BareRepoPage() {
    const [protocol, setProtocol] = useState('HTTPS');

    const createRepoStr = [
        'echo "# test" >> README.md',
        'git init',
        'git add README.md',
        'git commit -m "first commit"',
        `git remote add origin ${url}`,
        'git push -u origin master'
    ];

    const pushRepoSrt = [
        `git remote add origin ${url}\n`,
        'git push -u origin master'
    ];

    const getString = (stringsArray) => {
        return stringsArray.reduce((result, str, i, array) => {
            return i < array.length - 1 ? `${result}${str}\n` : `${result}${str}`;
        });
    };

    const copyToClipboard = (str) => navigator.clipboard.writeText(str);

    function copyCreateRepoStr() {
        const str = getString(pushRepoSrt);
        copyToClipboard(str);
    }

    function copyPushRepoStr() {
        const str = getString(createRepoStr);
        copyToClipboard(str);
    }

    function copyUrl() {
        copyToClipboard(url);
    }

    function setHttp() {
        setProtocol('HTTP');
    }

    function setSsh() {
        setProtocol('SSH');
    }

    return (
        <Container>
            <div className={styles.box}>
                <section className={styles.boxSectionHeader}>
                    <h2>Quick setup — if you’ve done this kind of thing before</h2>
                    <div className={styles.urlGroup}>
                        <Button.Group>
                            <Button
                                active={protocol === 'HTTPS'}
                                onClick={setHttp}
                            >
                                HTTPS
                            </Button>
                            <Button
                                active={protocol === 'SSH'}
                                onClick={setSsh}
                            >
                                SSH
                            </Button>
                        </Button.Group>
                        <span className={styles.clipboardInput}>{url}</span>
                        <Button
                            icon="clipboard"
                            onClick={copyUrl}
                        ></Button>
                    </div>
                    <p>
                        Get started
                        {<Link> creating a new file</Link>} by or
                        {<Link> uploading an existing file</Link>}. We recommend every repository include a
                        {<Link> README</Link>},
                        {<Link> LICENSE</Link>},
                        and
                        {<Link> .gitignore</Link>}.
                    </p>
                </section>
                <section className={styles.boxSection}>
                    <h2>…or create a new repository on the command line</h2>
                    <div className={styles.copyable}>
                        <pre>
                            {getString(createRepoStr)}
                        </pre>
                        <Button
                            className={styles.clipboardButton}
                            icon="clipboard"
                            onClick={copyCreateRepoStr}
                        >
                        </Button>
                    </div>
                </section>
                <section className={styles.boxSection}>
                    <h2>…or push an existing repository from the command line</h2>
                    <div className={styles.copyable}>
                        <pre>
                            {getString(pushRepoSrt)}
                        </pre>
                        <Button
                            className={styles.clipboardButton}
                            icon="clipboard"
                            onClick={copyPushRepoStr}
                        ></Button>
                    </div>
                </section>
                <section className={styles.boxSection}>
                    <h2>…or import code from another repository</h2>
                    <p>You can initialize this repository with code from a Subversion, Mercurial, or TFS project.</p>
                    <Button as='a'>Import code</Button>
                </section>
            </div>
            <p className={styles.protip}>
                <Icon name='idea' />
                ProTip! Use the URL for this page when adding GitHub as a remote.
            </p>
        </Container>
    );
}

export default BareRepoPage;
