import React from 'react';
import { Grid, Menu, Header, Divider, Image, Input, Button, TextArea } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import NOTES from './notes';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

const SettingsPage = props => (
    <Grid container>
        <Grid.Column width={4}>
            <Menu vertical>
                <Menu.Item header>Personal settings</Menu.Item>
                <Menu.Item>Profile</Menu.Item>
            </Menu>
        </Grid.Column>
        <Grid.Column width={12}>
            <Header as="h2">Public profile</Header>
            <Divider />
            <Grid>
                <Grid.Column width={11}>
                    <Formik initialValues={props.data} onSubmit={onSubmit}>
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
                <Grid.Column width={5}>
                    <Header as="h4">Profile picture</Header>
                    <Image
                        src="https://avatars3.githubusercontent.com/u/43011715?s=400&u=ad60df6df50e7d47ba97c26709508502feb4f342&v=4"
                        fluid
                        rounded
                    />
                </Grid.Column>
            </Grid>
        </Grid.Column>
    </Grid>
);

renderField.propTypes = {
    field: PropTypes.object
};

renderTextArea.propTypes = {
    field: PropTypes.object
};

SettingsPage.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object
};

SettingsPage.defaultProps = {
    data: {
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
    return { ...state.settings };
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);
