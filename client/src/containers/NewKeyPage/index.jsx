import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, Redirect } from 'react-router-dom';
import { Breadcrumb, Button, Form, Header } from 'semantic-ui-react';
import { addKey } from '../../services/userService';
import { InputError } from '../../components/InputError';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const NewKeyPage = props => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .max(100),
    key: Yup.string()
      .matches(
        /^(ssh-rsa AAAAB3NzaC1yc2|ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNT|ssh-ed25519 AAAAC3NzaC1lZDI1NTE5|ssh-dss AAAAB3NzaC1kc3)[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?$/,
        'Provided SSH key is invalid'
      )
      .required('SSH key is required')
  });

  function handleSubmit({ title, key }) {
    setLoading(true);
    addKey({ title, value: key, userId: props.userId }).then(() => {
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
      <Formik
        initialValues={{ title: '', key: '' }}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={handleSubmit}
      >
        {({ values: { title, key }, errors, handleChange, handleBlur, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Input
              label="Title"
              name="title"
              value={title}
              width="5"
              error={!!errors.title}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={loading}
            />
            <InputError name="title" />
            <Form.TextArea
              label="Title"
              name="key"
              rows="8"
              placeholder="Begins with 'ssh-rsa', 'ssh-dss', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', or 'ecdsa-sha2-nistp521'"
              error={!!errors.key}
              content={key}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={loading}
            />
            <InputError name="key" />
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

NewKeyPage.propTypes = {
  userId: PropTypes.string.isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId }
  }
}) => {
  return {
    userId
  };
};

export default connect(mapStateToProps)(NewKeyPage);
