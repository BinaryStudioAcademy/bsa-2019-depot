import React, { Component } from 'react';
import {
    Grid,
    Menu,
    Header,
    Divider,
    Image,
    Input,
    Button,
    TextArea,
    Icon,
    Segment,
    Dropdown
} from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import NOTES from './notes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHeader from '../../containers/Header';
import { updateUserSettings } from '../../routines/routines';

import styles from './styles.module.scss';
import avatarPlaceholder from './avatar-placeholder.svg';

class SettingsProfile extends Component {
  renderField = ({ field }) => <Input fluid {...field} />;

  renderDisabledField = ({ field }) => <Input disabled fluid {...field} />;

  renderTextArea = ({ field }) => (
      <TextArea {...field} rows="3" placeholder="Tell us a little bit about yourself" className={styles.textarea} />
  );

  onSubmit = (values, { setSubmitting }) => {
      const { id, bio, company, location, name, imgUrl, url } = values;
      const payload = { id, settings: { bio, company, location, name, imgUrl, url } };
      this.props.updateUserSettings(payload);
  };

  onUploadPhoto = ev => {
      console.warn('Upload photo!');
  };

  onRemovePhoto = ev => {
      console.warn('Remove photo!');
  };

  imgEditBtn = (
    <Button secondary compact size="tiny">
        <Icon name="edit" />
      Edit
    </Button>
  );

  render() {
      return (
          <div>
              <PageHeader />
              <Divider hidden />
              <Grid container>
                  <Grid.Column computer={4} tablet={8} mobile={16}>
                      <Menu vertical>
                          <Menu.Item header>Personal settings</Menu.Item>
                          <Menu.Item>Profile</Menu.Item>
                      </Menu>
                  </Grid.Column>
                  <Grid.Column computer={12} tablet={16} mobile={16}>
                      <Header as="h2">Public profile</Header>
                      <Divider />
                      <Grid>
                          <Grid.Column computer={11} tablet={16} mobile={16}>
                              <Formik initialValues={this.props.currentUser} onSubmit={this.onSubmit}>
                                  {({ isSubmitting }) => (
                                      <Form className="ui form">
                                          <Header as="h4">Name</Header>
                                          <Field type="text" name="name" render={this.renderField} />
                                          <div>{NOTES.name}</div>

                                          <Header as="h4">Public email</Header>
                                          <Field type="email" name="email" render={this.renderDisabledField} />
                                          <div>{NOTES.email}</div>

                                          <Header as="h4">Bio</Header>
                                          <Field name="bio" render={this.renderTextArea} />
                                          <div>{NOTES.bio}</div>

                                          <Header as="h4">URL</Header>
                                          <Field type="text" name="url" render={this.renderField} />

                                          <Header as="h4">Company</Header>
                                          <Field type="text" name="company" render={this.renderField} />
                                          <div>{NOTES.company}</div>

                                          <Divider />

                                          <Header as="h4">Location</Header>
                                          <Field type="text" name="location" render={this.renderField} />

                                          <Divider hidden />
                                          <div>{NOTES.disclaimer}</div>
                                          <Divider hidden />

                                          <Button color="green" type="submit" disabled={this.props.currentUser.loading}>
                        Update profile
                                          </Button>
                                      </Form>
                                  )}
                              </Formik>
                          </Grid.Column>
                          <Grid.Column computer={5} tablet={8} mobile={16}>
                              <Segment basic className={styles.no_padding}>
                                  <Header as="h4">Profile picture</Header>
                                  <Image src={this.props.currentUser.imgUrl || avatarPlaceholder} fluid rounded></Image>
                                  <Dropdown trigger={this.imgEditBtn} pointing="top left" icon={null} className={styles.img_edit_btn}>
                                      <Dropdown.Menu className={styles.dropdown}>
                                          <Dropdown.Item onClick={this.onUploadPhoto}>Upload a photo...</Dropdown.Item>
                                          <Dropdown.Item onClick={this.onRemovePhoto}>Remove photo</Dropdown.Item>
                                      </Dropdown.Menu>
                                  </Dropdown>
                              </Segment>
                          </Grid.Column>
                      </Grid>
                  </Grid.Column>
              </Grid>
          </div>
      );
  }
}

SettingsProfile.propTypes = {
    currentUser: PropTypes.object,
    updateUserSettings: PropTypes.func
};

const mapStateToProps = state => {
    console.warn(state.profile);

    return state.profile;
};

const mapDispatchToProps = { updateUserSettings };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsProfile);
