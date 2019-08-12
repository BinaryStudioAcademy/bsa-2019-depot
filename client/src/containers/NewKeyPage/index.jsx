import React from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Form, Header } from 'semantic-ui-react';

class NewKeyPage extends React.Component {
  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit(this);
  }

  validate({ title, key }) {
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

  handleSubmit() {}

  render() {
    return (
      <>
        <Header as="h2" dividing>
          <Breadcrumb size="massive">
            <Breadcrumb.Section link>
              <Link to="/settings/keys">SSH keys</Link>
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section>Add new</Breadcrumb.Section>
          </Breadcrumb>
        </Header>
        <Formik initialValues={{ title: '', key: '' }} validate={this.validate} onSubmit={this.handleSubmit}>
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
              />
              <Button type="submit" positive>
                Add SSH key
              </Button>
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default NewKeyPage;
