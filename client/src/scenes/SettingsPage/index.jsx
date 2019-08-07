/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Form as SemanticForm, Grid, Menu, Header, Divider, Image, Input, Button, TextArea } from 'semantic-ui-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NOTES from './notes';

const SettingsPage = () => (
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
                    <Formik
                        initialValues={{ name: 'Vasyl Boyko', email: 'vboiko0@gmail.com' }}
                        validate={values => {
                            let errors = {};
                            if (!values.email) {
                                errors.email = 'Required';
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }
                            return errors;
                        }}
                        // onSubmit={(values, { setSubmitting }) => {
                        //     setTimeout(() => {
                        //         alert(JSON.stringify(values, null, 2));
                        //         setSubmitting(false);
                        //     }, 400);
                        // }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Header as="h4">Name</Header>
                                <Field type="text" name="name" render={({ field }) => <Input fluid {...field} />} />
                                <ErrorMessage name="name" component="div" />
                                <div>{NOTES.name}</div>

                                <Header as="h4">Public email</Header>
                                <Field type="email" name="email" render={({ field }) => <Input fluid {...field} />} />
                                <ErrorMessage name="email" component="div" />
                                <div>{NOTES.email}</div>

                                <Header as="h4">Bio</Header>
                                <Field
                                    name="bio"
                                    render={() => (
                                        <SemanticForm>
                                            <TextArea rows="3" placeholder="Tell us a little bit about yourself" />
                                        </SemanticForm>
                                    )}
                                />
                                <div>{NOTES.bio}</div>

                                <Header as="h4">URL</Header>
                                <Field type="text" name="url" render={({ field }) => <Input fluid {...field} />} />
                                <ErrorMessage name="url" component="div" />

                                <Header as="h4">Company</Header>
                                <Field type="text" name="company" render={({ field }) => <Input fluid {...field} />} />
                                <div>{NOTES.company}</div>

                                <Divider />

                                <Header as="h4">Location</Header>
                                <Field type="text" name="location" render={({ field }) => <Input fluid {...field} />} />

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

export default SettingsPage;
