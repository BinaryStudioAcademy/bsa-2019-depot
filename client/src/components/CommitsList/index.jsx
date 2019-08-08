import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Divider, Icon, Image, List } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUserImgLink } from '../../helpers/imageHelper';

import './styles.module.scss';

const CommitsList = ({ commits }) => {
    return (
        <List divided verticalAlign="middle">
            {commits.map((commit, index, array) => {
                let divider;
                if (index === 0 || !moment(commit.date).isSame(array[index - 1].date, 'day')) {
                    divider = <Divider horizontal>{moment(commit.date).format('MMM D, YYYY')}</Divider>;
                }
                return (
                    <Fragment key={`${commit.sha}`}>
                        {divider}
                        <List.Item>
                            <List.Content floated="right">
                                <Button.Group>
                                    <CopyToClipboard text={commit.sha}>
                                        <Button basic color="blue" icon>
                                            <Icon name="copy" />
                                        </Button>
                                    </CopyToClipboard>
                                    <Button basic color="blue">
                                        {commit.sha.slice(0, 7)}
                                    </Button>
                                </Button.Group>
                                <Button basic color="blue" icon>
                                    <Icon name="code" />
                                </Button>
                            </List.Content>
                            <List.Content>
                                <List.Header>{commit.message}</List.Header>
                                <List.Description>
                                    <Image src={getUserImgLink(commit.author.avatar)} avatar />
                                    {` ${commit.author} committed ${moment(commit.date).fromNow()}`}
                                </List.Description>
                            </List.Content>
                        </List.Item>
                    </Fragment>
                );
            })}
        </List>
    );
};

CommitsList.propTypes = {
    commits: PropTypes.arrayOf(
        PropTypes.exact({
            sha: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired
        })
    ).isRequired
};

export default CommitsList;
