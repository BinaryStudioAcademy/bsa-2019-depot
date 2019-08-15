import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
// import { getUserImgLink } from '../../helpers/imageHelper';
// import { List, Icon, Image, Popup } from 'semantic-ui-react';
import { List, Icon } from 'semantic-ui-react';

import './styles.module.scss';

const BranchesList = ({ branches }) => {
  return (
    <List divided verticalAlign="middle">
      {branches.map((branch, idx) => (
        <List.Item key={idx}>
          <List.Content floated="right">
            <Icon name="comments outline" /> {branch.name}
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

BranchesList.propTypes = {
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      merged: PropTypes.shape({
        number: PropTypes.number
      }).isRequired
      // createdAt: PropTypes.string.isRequired
    })
  ).isRequired
};

export default BranchesList;
