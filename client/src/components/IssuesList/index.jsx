import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getUserImgLink } from '../../helpers/imageHelper';
import { List, Icon, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import './styles.module.scss';

const IssuesList = props => {
  const {
    issues,
    match: { url }
  } = props;
  return (
    issues.length > 0 && (
      <List divided verticalAlign="middle">
        {issues.map(issue => (
          <List.Item key={issue.id}>
            <List.Content floated="right">
              <Icon name="comments outline" /> {issue.commentCount}
            </List.Content>
            <List.Content floated="right">
              {issue.assignees &&
                issue.assignees
                  .slice(0, 3)
                  .map(assignee => (
                    <Popup
                      key={assignee.username}
                      content={`Assigned to ${assignee.username}`}
                      trigger={<Image src={getUserImgLink(assignee.avatar)} avatar />}
                    />
                  ))}
            </List.Content>
            <Icon name={issue.opened ? 'info' : 'check'} color={issue.opened ? 'green' : 'red'} />
            <List.Content>
              <List.Header>
                <Link to={`${url}/${issue.id}`}>{issue.title}</Link>
              </List.Header>
              <List.Description>
                {`#${issue.id} opened ${moment(issue.createdAt).fromNow()} by ${issue.user.username}`}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    )
  );
};

IssuesList.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      author: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      assignees: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string.isRequired,
          avatar: PropTypes.string
        })
      ),
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          color: PropTypes.string.isRequired
        })
      ),
      opened: PropTypes.bool.isRequired,
      commentCount: PropTypes.number,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

export default IssuesList;
