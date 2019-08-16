import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Icon, Button } from 'semantic-ui-react';

import styles from './styles.module.scss';

const BranchesList = ({ branches, username, reponame }) => {
  return (
    <List divided className={styles.branchesList} verticalAlign="middle">
      {branches.map((branch, idx) => {
        const pathToBranch = `/${username}/${reponame}/${branch.name}`;
        const updatedOn = moment(branch.date).format('MMM D, YYYY');
        return (
          <List.Item key={idx} className={styles.listItem}>
            <List.Content floated="left">
              <span className={styles.branchLink}>
                <a href={pathToBranch}>{branch.name}</a>
              </span>
              <span className="updated-by">
                Updated on {updatedOn} by {branch.author}
              </span>
            </List.Content>
            <List.Content floated="right">
              <Button size="tiny">
                <Icon name="window restore outline icon" />
                New Pull Request{' '}
              </Button>
              <Button icon size="tiny">
                <Icon name="trash" color="red" />
              </Button>
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
        number: PropTypes.number
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
