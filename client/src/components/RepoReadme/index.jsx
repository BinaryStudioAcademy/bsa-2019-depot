import React from 'react';

import { Segment, Header, List } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';
import styles from './styles.module.scss';

const RepoReadme = () => {
    return (
        <Segment.Group>
            <Header className={styles.readmeHeader} as="h4" attached="top" block>
                <div>
                    <Octicon icon={getIconByName('book')} />
          README.md
                </div>
                <Octicon icon={getIconByName('pencil')} />
            </Header>
            <Segment padded>
                <h1>Semantic UI</h1>
                <p>Semantic is a UI framework designed for theming.</p>
                <p>Key Features</p>
                <List bulleted>
                    <List.Item>50+ UI elements</List.Item>
                    <List.Item>3000 + CSS variables</List.Item>
                    <List.Item>3 Levels of variable inheritance (similar to SublimeText)</List.Item>
                    <List.Item>Built with EM values for responsive design</List.Item>
                    <List.Item>Flexbox friendly</List.Item>
                </List>
            </Segment>
        </Segment.Group>
    );
};

export default RepoReadme;
