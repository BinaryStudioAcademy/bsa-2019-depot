import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';

const IssuesList = ({ issues }) => {
    return (
        <List divided verticalAlign="middle">
            {issues.map(issue => (
                <List.Item key={issue.id}>
                    <List.Content floated="right">
                        <Icon name="comments outline" /> {issue.commentCount}
                    </List.Content>
                    <Icon name={issue.opened ? 'info' : 'check'} color={issue.opened ? 'green' : 'red'} />
                    <List.Content>{issue.text}</List.Content>
                </List.Item>
            ))}
        </List>
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
    ).isRequired
};

export default IssuesList;
