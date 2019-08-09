import React from 'react';
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

import styles from './styles.module.scss';

const renderField = ({ field }) => <Input fluid {...field} />;

const renderTextArea = ({ field }) => (
    <TextArea {...field} rows="3" placeholder="Tell us a little bit about yourself" style={{ maxHeight: 200 }} />
);

const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
    }, 400);
};

const onUploadPhoto = ev => {
    console.warn('Upload photo!');
};

const onRemovePhoto = ev => {
    console.warn('Remove photo!');
};

const imgEditBtn = (
    <Button secondary compact size="tiny">
        <Icon name="edit" />
    Edit
    </Button>
);

const SettingsProfile = props => (
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
                        <Formik initialValues={props.currentUser} onSubmit={onSubmit}>
                            {({ isSubmitting }) => (
                                <Form className="ui form">
                                    <Header as="h4">Name</Header>
                                    <Field type="text" name="name" render={renderField} />
                                    <div>{NOTES.name}</div>

                                    <Header as="h4">Public email</Header>
                                    <Field type="email" name="email" render={renderField} />
                                    <div>{NOTES.email}</div>

                                    <Header as="h4">Bio</Header>
                                    <Field name="bio" render={renderTextArea} />
                                    <div>{NOTES.bio}</div>

                                    <Header as="h4">URL</Header>
                                    <Field type="text" name="url" render={renderField} />

                                    <Header as="h4">Company</Header>
                                    <Field type="text" name="company" render={renderField} />
                                    <div>{NOTES.company}</div>

                                    <Divider />

                                    <Header as="h4">Location</Header>
                                    <Field type="text" name="location" render={renderField} />

                                    <Divider hidden />
                                    <div>{NOTES.disclaimer}</div>
                                    <Divider hidden />

                                    <Button color="green" type="submit" disabled={isSubmitting}>
                    Update profile
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Grid.Column>
                    <Grid.Column computer={5} tablet={8} mobile={16}>
                        <Segment basic className={styles.no_padding}>
                            <Header as="h4">Profile picture</Header>
                            <Image
                                src="https://avatars3.githubusercontent.com/u/43011715?s=400&u=ad60df6df50e7d47ba97c26709508502feb4f342&v=4"
                                fluid
                                rounded
                            ></Image>
                            <Dropdown trigger={imgEditBtn} pointing="top left" icon={null} className={styles.img_edit_btn}>
                                <Dropdown.Menu className={styles.dropdown}>
                                    <Dropdown.Item onClick={onUploadPhoto}>Upload a photo...</Dropdown.Item>
                                    <Dropdown.Item onClick={onRemovePhoto}>Remove photo</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Grid.Column>
        </Grid>
    </div>
);

renderField.propTypes = {
    field: PropTypes.object
};

renderTextArea.propTypes = {
    field: PropTypes.object
};

SettingsProfile.propTypes = {
    currentUser: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object
};

SettingsProfile.defaultProps = {
    currentUser: {
        name: '',
        email: '',
        bio: '',
        url: '',
        company: '',
        location: '',
        imgUrl: ''
    },
    loading: false,
    error: null
};

const mapStateToProps = state => {
    return state.profile;
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsProfile);
