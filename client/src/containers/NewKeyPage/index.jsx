import React, { useState } from 'react';
import { Formik } from 'formik';
import { Link, Redirect } from 'react-router-dom';
import { Breadcrumb, Button, Form, Header } from 'semantic-ui-react';
import { addKey } from '../../services/userService';

const NewKeyPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate({ title, key }) {
    const sshRegExp = /^(ssh-rsa AAAAB3NzaC1yc2|ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNT|ssh-ed25519 AAAAC3NzaC1lZDI1NTE5|ssh-dss AAAAB3NzaC1kc3)[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?$/;
    let errors = {};

    if (!title) {
      errors.title = 'Required';
    }
    if (!key) {
      errors.key = 'Required';
    } else if (!key.match(sshRegExp)) {
      errors.key = 'Invalid SSH key provided';
    }

    return errors;
  }

  function handleSubmit({ title, key }) {
    setLoading(true);
    addKey({ title, value: key }).then(() => {
      setLoading(true);
      setSubmitted(true);
    });
  }

  return submitted ? (
    <Redirect to="/settings/keys" />
  ) : (
    <>
      <Header as="h2" dividing>
        <Breadcrumb size="massive">
          <Breadcrumb.Section>
            <Link to="/settings/keys">SSH keys</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section>Add new</Breadcrumb.Section>
        </Breadcrumb>
      </Header>
      <Formik initialValues={{ title: '', key: '' }} validate={validate} onSubmit={handleSubmit}>
        {({ values: { title, key }, touched, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Input
              label="Title"
              name="title"
              value={title}
              width="5"
              error={errors.title && touched.title && { content: errors.title }}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={loading}
            />
            <Form.TextArea
              label="Title"
              name="key"
              rows="8"
              placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or 'ecdsa-sha2-nistp521'"
              error={errors.key && touched.key && { content: errors.key }}
              content={key}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              loading={loading}
              disabled={!!errors.title || !!errors.key || !title || !key}
              positive
            >
              Add SSH key
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewKeyPage;
