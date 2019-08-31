import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Segment, Header } from 'semantic-ui-react';
import Octicon, { getIconByName } from '@primer/octicons-react';

import styles from './styles.module.scss';

const RepoReadme = ({ content, showEdit, onReadmeEdit }) => {
  return (
    <Segment.Group>
      <Header className={styles.readmeHeader} as="h4" attached="top" block>
        <div>
          <Octicon icon={getIconByName('book')} />
          README.md
        </div>
        {showEdit && (
          <span onClick={onReadmeEdit}>
            <Octicon icon={getIconByName('pencil')} className={styles.editReadme} />
          </span>
        )}
      </Header>
      <Segment padded>
        <ReactMarkdown source={content} className={styles.markdownContainer} />
      </Segment>
    </Segment.Group>
  );
};

RepoReadme.propTypes = {
  content: PropTypes.string,
  showEdit: PropTypes.bool.isRequired,
  onReadmeEdit: PropTypes.func.isRequired
};

RepoReadme.defaultProps = {
  content: ''
};

export default RepoReadme;
