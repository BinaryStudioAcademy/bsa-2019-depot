import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getUserImgLink } from '../../helpers/imageHelper';
import { List, Icon, Image, Popup, Label } from 'semantic-ui-react';
import { PullRequestOutline } from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';
import { Link } from 'react-router-dom';
import Color from 'color';

import styles from './styles.module.scss';
AntdIcon.add(PullRequestOutline);

const renderIcon = status => {
  switch (status) {
  case 'OPEN':
    return (
      <Icon>
        <AntdIcon type={PullRequestOutline} style={{ color: '#28a745' }} />
      </Icon>
    );
  case 'CLOSED':
    return (
      <Icon>
        <AntdIcon type={PullRequestOutline} style={{ color: '#ED1A37' }} />
      </Icon>
    );
  case 'MERGED':
    return (
      <Icon>
        <AntdIcon type={PullRequestOutline} style={{ color: '#6f42c1' }} />
      </Icon>
    );
  default:
    return null;
  }
};

function changeTextColor(labelColor) {
  return Color(labelColor).isDark() ? '#f7f7fb' : '#363a44';
}

const DataList = props => {
  const { data, isPull } = props;
  return (
    data.length > 0 && (
      <List divided verticalAlign="middle">
        {data.map(item => {
          const labels = isPull ? item.pullLabels : item.issueLabels;
          const assignees = isPull ? [] : item.issueAssignees.map(issueAssignee => issueAssignee.assignee);
          return (
            <List.Item key={item.id} className={styles.container}>
              <List.Content floated="right">
                <Icon name="comments outline" /> {item.commentCount}
              </List.Content>
              <List.Content floated="right" className={styles.assignees}>
                {assignees &&
                  assignees
                    .slice(0, 3)
                    .map(assignee => (
                      <Popup
                        key={assignee.username}
                        content={`Assigned to ${assignee.username}`}
                        trigger={<Image src={getUserImgLink(assignee.avatar)} avatar />}
                      />
                    ))}
              </List.Content>
              {isPull ? (
                renderIcon(item.prstatus.name)
              ) : (
                <Icon name={item.isOpened ? 'info circle' : 'check'} color={item.isOpened ? 'green' : 'red'} />
              )}
              <List.Content>
                <List.Header>
                  <Link
                    to={`/${item.repository.user.username}/${item.repository.name}/${isPull ? 'pulls' : 'issues'}/${
                      item.number
                    }`}
                  >
                    {item.title}
                    {labels &&
                      labels.map(({ label }) => (
                        <Label
                          size="mini"
                          key={label.id}
                          style={{
                            background: `${label.color}`,
                            color: changeTextColor(label.color),
                            marginLeft: '5px'
                          }}
                        >
                          {label.name}
                        </Label>
                      ))}
                  </Link>
                </List.Header>
                <List.Description>
                  {isPull ? (
                    <>
                      #{item.number} {item.prstatus.name.toLowerCase()} {moment(item.updatedAt).fromNow()} by{' '}
                      {item.user.username}
                      {item.reviewStatus ? (
                        <>
                          <Icon className={styles.circleDivider} size="mini" name="circle" />
                          {item.reviewStatus}
                        </>
                      ) : null}
                    </>
                  ) : (
                    `#${item.number} ${item.isOpened ? 'opened' : 'closed'} ${moment(item.updatedAt).fromNow()} by ${
                      item.user.username
                    }`
                  )}
                </List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    )
  );
};

DataList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
      user: PropTypes.shape({
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
      isOpened: PropTypes.bool,
      prstatus: PropTypes.object,
      commentCount: PropTypes.number,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  isPull: PropTypes.bool
};

export default DataList;
