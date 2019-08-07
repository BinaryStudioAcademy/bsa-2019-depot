import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Divider, Icon, Image, List } from 'semantic-ui-react';

import '../IssuesList/styles.module.scss';

const CommitsList = ({ commits }) => {
    return (
        <List divided verticalAlign="middle">
            {commits.map((commit, index, array) => {
                let divider;
                if (index === 0 || !moment(commit.date).isSame(array[index - 1].date)) {
                    divider = <Divider horizontal>{moment(commit.date).format('MMM D, YYYY')}</Divider>;
                }
                return (
          <>
            {divider}
            <List.Item key={commit.sha}>
                <List.Content floated="right">
                    <Button.Group>
                        <Button basic color="blue">
                            <Icon name="copy" />
                        </Button>
                        <Button basic color="blue">
                            {commit.sha.slice(0, 7)}
                        </Button>
                    </Button.Group>
                    <Button basic color="blue">
                        <Icon name="code" />
                    </Button>
                </List.Content>
                <List.Content>
                    <List.Header>{commit.message}</List.Header>
                    <List.Description>
                        <Image src={commit.author.avatar} avatar />
                  committed {moment(commit.createdAt).fromNow()}
                    </List.Description>
                </List.Content>
            </List.Item>
          </>
                );
            })}
        </List>
    );
};

CommitsList.propTypes = {
    commits: PropTypes.array // TODO: Define concretely
};

export default CommitsList;
