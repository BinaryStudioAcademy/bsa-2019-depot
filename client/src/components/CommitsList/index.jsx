import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Divider, Icon, Image, List } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUserImgLink } from '../../helpers/imageHelper';

import './styles.module.scss';

const CommitsList = ({ commits, match: { params } }) => {
  const { username, reponame } = params;

  return (
    <List divided verticalAlign="middle">
      {commits.map((commit, index, array) => {
        let divider;
        if (index === 0 || !moment(commit.createdAt).isSame(array[index - 1].createdAt, 'day')) {
          divider = <Divider horizontal>{moment(commit.createdAt).format('MMM D, YYYY')}</Divider>;
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
                    <NavLink exact to={`/${username}/${reponame}/commit/${commit.sha}`}>
                      {commit.sha.slice(0, 7)}
                    </NavLink>
                  </Button>
                </Button.Group>
                <Button basic color="blue" icon>
                  <Icon name="code" />
                </Button>
              </List.Content>
              <List.Content>
                <List.Header>{commit.message}</List.Header>
                <List.Description>
                  <Image src={getUserImgLink(commit.user.imgUrl)} avatar />
                  {` ${commit.user.username} committed ${moment(commit.createdAt).fromNow()}`}
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
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(CommitsList);
