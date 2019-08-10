import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Octicon, { Repo } from '@primer/octicons-react';
import { Button, Icon, Label } from 'semantic-ui-react';

import styles from './styles.module.scss';

const RepositoryHeader = ({ owner, repoName, activeTab, forkCount, issueCount }) => {
    return (
        <header className={styles.repoHeader}>
            <div className={styles.repoHeaderContainer}>
                <div className={styles.repoNameRow}>
                    <div className={styles.repoName}>
                        <Octicon icon={Repo} />
                        <span className={styles.repoPath}>
                            <Link to="">{owner}</Link>
                            <span className={styles.pathDivider}>/</span>
                            <Link to="/repository">{repoName}</Link>
                        </span>
                    </div>
                    <Button size="small" as="div" compact labelPosition="right">
                        <Button size="small" compact>
                            <Icon name="fork" />
              Fork
                        </Button>
                        <Label as="a" basic pointing="left">
                            {forkCount}
                        </Label>
                    </Button>
                </div>
                <div className="ui top attached tabular menu">
                    <div className={`${(!activeTab || activeTab === 'commits') && 'active'} item`}>
                        <Link to="/repository">
                            <Icon name="code" /> Code
                        </Link>
                    </div>
                    <div className={`${activeTab === 'issues' && 'active'} item`}>
                        <Link to="/repository/issues">
              Issues<Label circular>{issueCount}</Label>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

RepositoryHeader.propTypes = {
    owner: PropTypes.string.isRequired,
    repoName: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    forkCount: PropTypes.number.isRequired,
    issueCount: PropTypes.number.isRequired
};

export default RepositoryHeader;
