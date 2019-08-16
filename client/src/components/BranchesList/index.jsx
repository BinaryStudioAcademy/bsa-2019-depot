import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Icon, Button, Label } from 'semantic-ui-react';
// import { ReactComponent as PRIconSvg } from '../../styles/assets/icons/pullrequest.svg';

import styles from './styles.module.scss';

const BranchesList = ({ branches, username, reponame }) => {
  const branchesCount = branches.length;
  if (!branchesCount) {
    return (
      <List divided className={styles.branchesList} verticalAlign="middle">
        <List.Item key={0} className={styles.listItem}>
          <List.Content className={styles.listItemGroup} floated="left">
            There are no branches matching your selected parameters
          </List.Content>
        </List.Item>
      </List>
    );
  }
  return (
    <List divided className={styles.branchesList} verticalAlign="middle">
      {branches.map((branch, idx) => {
        const pathToBranch = `/${username}/${reponame}/tree/${branch.name}`;
        const updatedOn = moment(branch.date).format('MMM D, YYYY');
        return (
          <List.Item key={idx} className={styles.listItem}>
            <List.Content className={styles.listItemGroup} floated="left">
              <span className={styles.branchLink}>
                <a href={pathToBranch}>{branch.name}</a>
              </span>
              <span className="updated-by">
                Updated on {updatedOn} by {branch.author}
              </span>
            </List.Content>
            <List.Content floated="right">
              {branch.merged ? (
                <p className={styles.pullRequest}>
                  <span className={styles.pullRequestNumber}>#{branch.merged.number}</span>
                  <Label color="purple" className={styles.pullRequestStatus}>
                    #{branch.merged.status}
                  </Label>
                </p>
              ) : (
                <>
                  <Button size="tiny">
                    <Icon name="window restore outline" />
                    New Pull Request
                  </Button>
                  <Button icon size="tiny">
                    <Icon name="trash" color="red" />
                  </Button>
                </>
              )}
            </List.Content>
          </List.Item>
        );
      })}
    </List>
  );
};

BranchesList.propTypes = {
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      merged: PropTypes.shape({
        number: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired
      }),
      status: PropTypes.string.isRequired,
      ownedByCurrentUser: PropTypes.bool.isRequired,
      author: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired,
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string.isRequired
};

export default BranchesList;
