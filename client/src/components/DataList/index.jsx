import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getUserImgLink } from '../../helpers/imageHelper';
import { List, Icon, Image, Popup } from 'semantic-ui-react';
import { PullRequestOutline} from '@ant-design/icons';
import AntdIcon from '@ant-design/icons-react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';
AntdIcon.add(PullRequestOutline);

const renderIcon = (status) => {
  switch(status) {
  case 'OPEN':
    return <Icon><AntdIcon type={PullRequestOutline} style={{color: '#28a745'}} /></Icon>;
  case 'CLOSED':
    return <Icon><AntdIcon type={PullRequestOutline} style={{color: '#ED1A37'}} /></Icon>;
  case 'MERGED':
    return <Icon><AntdIcon type={PullRequestOutline} style={{color: '#6f42c1'}} /></Icon>;
  default:
    return null;
  }
};

const DataList = props => {
  const { data, isPull } = props;
  return (
    data.length > 0 && (
      <List divided verticalAlign="middle">
        {data.map(item => (
          <List.Item key={item.id} className={styles.container}>
            <List.Content floated="right">
              <Icon name="comments outline" /> {item.commentCount}
            </List.Content>
            <List.Content floated="right">
              {item.assignees &&
                item.assignees
                  .slice(0, 3)
                  .map(assignee => (
                    <Popup
                      key={assignee.username}
                      content={`Assigned to ${assignee.username}`}
                      trigger={<Image src={getUserImgLink(assignee.avatar)} avatar />}
                    />
                  ))}
            </List.Content>
            {isPull ? 
              renderIcon(item.prstatus.name)
              : (
                <Icon name={item.isOpened ? 'info circle' : 'check'} color={item.isOpened ? 'green' : 'red'} />
              )}
            <List.Content>
              <List.Header>
                <Link
                  to={`/${item.user.username}/${item.repository.name}/${isPull ? 'pulls' : 'issues'}/${item.number}`}
                >
                  {item.title}
                </Link>
              </List.Header>
              <List.Description>
                {`#${item.number} opened ${moment(item.createdAt).fromNow()} by ${item.user.username}`}
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
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
