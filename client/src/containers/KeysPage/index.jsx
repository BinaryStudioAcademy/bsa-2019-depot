import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Header, Icon, Label } from 'semantic-ui-react';

import styles from './styles.module.scss';

class KeysPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleNewKey = this.handleNewKey.bind(this);
  }

  getDaysDiff(dateA, dateB) {
    const a = moment(dateA);
    const b = moment(dateB);
    return Math.abs(a.diff(b, 'days'));
  }

  handleNewKey() {
    this.props.history.push('/settings/keys/new');
  }

  render() {
    // const { keys } = this.props;

    // Mocks
    const keys = [
      {
        title: 'work-windows',
        additionDate: new Date('December 17, 2018 03:24:00'),
        operation: 'Read/Write'
      },
      {
        title: 'home-ubuntu',
        additionDate: new Date('December 17, 2018 03:24:00'),
        lastUsed: new Date('July 12, 2019 03:24:00'),
        operation: 'Read/Write'
      }
    ];

    return (
      <>
        <Header as="h2" dividing>
          <Header.Content>SSH keys</Header.Content>
          <Button color="green" size="small" onClick={this.handleNewKey} compact>
            New SSH key
          </Button>
        </Header>
        <div className={styles.section}>
          <p>This is a list of SSH keys associated with your account. Remove any keys that you do not recognize.</p>
          <ul className={styles.keyList}>
            {keys.map(({ title, additionDate, lastUsed, operation }, index) => (
              <li key={index} className={styles.keyListItem}>
                <div className={styles.infoSection}>
                  <div className={styles.keyIcon}>
                    <Icon
                      color={lastUsed && this.getDaysDiff(lastUsed, Date.now()) <= 7 ? 'green' : 'black'}
                      size="big"
                      name="key"
                    />
                    <Label>SSH</Label>
                  </div>
                  <div className={styles.keyInfo}>
                    <div className={styles.keyTitle}>{title}</div>
                    <div className={styles.keyDescription}>
                      <div>Added on {moment(additionDate).format('MMM D, YYYY')}</div>
                      <div>{lastUsed ? `Last used ${moment(lastUsed).fromNow()} - ${operation}` : 'Never used'}</div>
                    </div>
                  </div>
                </div>
                <Button basic color="red" compact>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
          <p>
            Check out our guide to
            <a href="https://help.github.com/en/articles/connecting-to-github-with-ssh"> generating SSH keys </a>
            or troubleshoot
            <a href="https://help.github.com/ssh-issues/"> common SSH Problems</a>.
          </p>
        </div>
      </>
    );
  }
}

KeysPage.propTypes = {
  keys: PropTypes.array, // TODO: Define in details
  history: PropTypes.object.isRequired
};

export default KeysPage;
