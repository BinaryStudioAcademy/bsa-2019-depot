import React from 'react';
import { Grid, Menu, Header, Divider, Input, Button, Message } from 'semantic-ui-react';
import styles from './styles.module.scss';

const renderDangerField = (header, description, buttonName, clickHandler) => (
    <Message className={styles.dangerField}>
        <Grid>
            <Grid.Column width={12}>
                <Header as="h6">{header}</Header>
                <p>{description}</p>
            </Grid.Column>
            <Grid.Column width={4}>
                <Button type="button" className={styles.dangerButton} fluid onClick={clickHandler}>
                    {buttonName}
                </Button>
            </Grid.Column>
        </Grid>
    </Message>
);

class RepoSettings extends React.Component {
  makePrivateHandleClick = () => {};

  transferHandleClick = () => {};

  archiveHandleClick = () => {};

  deleteHandleClick = () => {};

  render() {
      return (
          <Grid container>
              <Grid.Column width={4}>
                  <Menu vertical>
                      <Menu.Item>Options</Menu.Item>
                  </Menu>
              </Grid.Column>
              <Grid.Column width={12}>
                  <Header as="h2">Settings</Header>
                  <Divider />

                  <Header as="h4">Repository name</Header>
                  <Input className={styles.text_input} />
                  <Button className={styles.button_rename} type="button">
            Rename
                  </Button>

                  <Header as="h2">Danger Zone</Header>
                  <div className={styles.dangerZone}>
                      {renderDangerField(
                          'Make this repository private',
                          'Hide this repository from the public. ',
                          'Make private',
                          this.makePrivateHandleClick
                      )}
                      {renderDangerField(
                          'Transfer ownership',
                          'Transfer this repository to another user or to an organization where you have the ability to create repositories.',
                          'Transfer',
                          this.transferHandleClick
                      )}
                      {renderDangerField(
                          'Archive this repository',
                          'Mark this repository as archived and read-only.',
                          'Archive this repository ',
                          this.archiveHandleClick
                      )}
                      {renderDangerField(
                          'Delete this repository',
                          'Once you delete a repository, there is no going back. Please be certain.',
                          'Delete this repository',
                          this.deleteHandleClick
                      )}
                  </div>
              </Grid.Column>
          </Grid>
      );
  }
}

export default RepoSettings;
