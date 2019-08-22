import React, { Component } from 'react';
import { Grid, Header, Divider, Image, Input, Button, TextArea, Icon, Segment, Dropdown } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateUserSettings } from '../../routines/routines';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';

import styles from './styles.module.scss';
import { getUserImgLink } from '../../helpers/imageHelper';
import { InputError } from '../../components/InputError';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .nullable()
    .max(255, 'Maximum length - 255 characters'),
  bio: Yup.string()
    .nullable()
    .max(160, 'Maximum length - 160 characters'),
  url: Yup.string()
    .nullable()
    .max(255, 'Maximum length - 255 characters'),
  company: Yup.string()
    .nullable()
    .max(255, 'Maximum length - 255 characters'),
  location: Yup.string()
    .nullable()
    .max(255, 'Maximum length - 255 characters')
});

class SettingsProfile extends Component {
  NOTES = {
    name: (
      <div>Your name may appear around Depot where you contribute or are mentioned. You can remove it at any time.</div>
    ),
    email: (
      <div>
        You have set your email address to private. To toggle email privacy, go to email settings and uncheck "Keep my
        email address private."
      </div>
    ),
    bio: (
      <div>
        You can @<strong>mention</strong> other users and organizations to link to them.
      </div>
    ),
    company: (
      <div>
        You can @<strong>mention</strong> your company’s Depot organization to link it.
      </div>
    ),
    disclaimer: (
      <div>
        All of the fields on this page are optional and can be deleted at any time, and by filling them out, you're
        giving us consent to share this data wherever your user profile appears. Please see our{' '}
        <NavLink to="/">privacy statement</NavLink> to learn more about how we use this information.
      </div>
    )
  };

  renderField = ({ field }) => {
    if (field.value === null) field.value = '';
    return <Input fluid {...field} />;
  };

  renderDisabledField = ({ field }) => <Input disabled fluid {...field} />;

  renderTextArea = ({ field }) => {
    if (field.value === null) field.value = '';
    return (
      <TextArea {...field} rows="3" placeholder="Tell us a little bit about yourself" className={styles.textarea} />
    );
  };

  onSubmit = (values, { setSubmitting }) => {
    const { id, bio, company, location, name, imgUrl, url } = values;
    const payload = { id, settings: { bio, company, location, name, imgUrl, url } };
    this.props.updateUserSettings(payload);
  };

  onUploadPhoto = ev => {
    // code for uploading photo goes here
  };

  onRemovePhoto = ev => {
    // code for removing photo goes here
  };

  imgEditBtn = (
    <Button secondary compact size="tiny">
      <Icon name="edit" />
      Edit
    </Button>
  );

  render() {
    const {
      currentUser: initialValues,
      currentUser: { loading, imgUrl }
    } = this.props;

    return (
      <>
        <Header as="h2">Public profile</Header>
        <Divider />
        <Grid>
          <>
            <Grid.Column computer={11} tablet={16} mobile={16}>
              <Formik initialValues={initialValues} onSubmit={this.onSubmit} validationSchema={validationSchema}>
                {({ isSubmitting, errors, touched }) => (
                  <Form className="ui form">
                    <Header as="h4">Name</Header>
                    <Field type="text" name="name" render={this.renderField} />
                    <InputError name="name" />
                    <div className={styles.note}>{this.NOTES.name}</div>

                    <Header as="h4">Public email</Header>
                    <Field type="email" name="email" render={this.renderDisabledField} />
                    <div className={styles.note}>{this.NOTES.email}</div>

                    <Header as="h4">Bio</Header>
                    <Field name="bio" render={this.renderTextArea} />
                    <InputError name="bio" />
                    <div className={styles.note}>{this.NOTES.bio}</div>

                    <Header as="h4">URL</Header>
                    <Field type="text" name="url" render={this.renderField} />
                    <InputError name="url" />

                    <Header as="h4">Company</Header>
                    <Field type="text" name="company" render={this.renderField} />
                    <InputError name="company" />
                    <div className={styles.note}>{this.NOTES.company}</div>

                    <Divider />

                    <Header as="h4">Location</Header>
                    <Field type="text" name="location" render={this.renderField} />
                    <InputError name="location" />

                    <Divider hidden />
                    <div className={styles.note}>{this.NOTES.disclaimer}</div>
                    <Divider hidden />

                    <Button color="blue" type="submit" disabled={loading}>
                      Update profile
                    </Button>
                  </Form>
                )}
              </Formik>
            </Grid.Column>
            <Grid.Column computer={5} tablet={8} mobile={16}>
              <Segment basic className={styles.no_padding}>
                <Header as="h4">Profile picture</Header>
                <Image src={getUserImgLink(imgUrl)} fluid rounded></Image>
                <Dropdown trigger={this.imgEditBtn} pointing="top left" icon={null} className={styles.img_edit_btn}>
                  <Dropdown.Menu className={styles.dropdown}>
                    <Dropdown.Item onClick={this.onUploadPhoto}>Upload a photo...</Dropdown.Item>
                    <Dropdown.Item onClick={this.onRemovePhoto}>Remove photo</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Segment>
            </Grid.Column>
          </>
        </Grid>
      </>
    );
  }
}

SettingsProfile.propTypes = {
  currentUser: PropTypes.object,
  updateUserSettings: PropTypes.func
};

const mapStateToProps = state => state.profile;

const mapDispatchToProps = { updateUserSettings };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsProfile);
