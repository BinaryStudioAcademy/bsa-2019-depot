import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Form, Grid } from 'semantic-ui-react';
import { Field, Formik } from 'formik';
import { InputError } from '../InputError';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import * as Yup from 'yup';

import 'react-mde/lib/styles/css/react-mde-all.css';
import styles from './styles.module.scss';

const CreateIssuePrForm = ({ isIssues, onSubmit }) => {
  const [selectedTab, setSelectedTab] = useState('write');
  const [body, setBody] = useState('');

  // labels mock
  const labelOptions = [
    { key: 1, text: 'One', value: 1, color: 'red' },
    { key: 2, text: 'Two', value: 2, color: 'green' },
    { key: 3, text: 'Three', value: 3, color: 'blue' }
  ];

  //assignees mock
  const assigneeOptions = [
    { key: 'af', value: 'af', text: 'John Doe' },
    { key: 'ax', value: 'ax', text: 'Alanda Java' },
    { key: 'al', value: 'al', text: 'Ivan Fortran' },
    { key: 'dz', value: 'dz', text: 'Michael Algol' }
  ];

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Required')
      .max(256, 'Maximum length - 256 characters')
  });

  function renderPreview() {
    return Promise.resolve(<ReactMarkdown source={body} />);
  }

  function renderLabel(label) {
    return {
      color: label.color,
      content: label.text
    };
  }

  function handleSubmit({ title }) {
    onSubmit(title, body);
  }

  return (
    <Formik initialValues={{ title: '' }} onSubmit={handleSubmit} validationSchema={validationSchema}>
      {({ values: { title, body }, errors, handleChange, handleSubmit }) => (
        <Form className={styles.issuePrForm} onSubmit={handleSubmit}>
          <Grid>
            <Grid.Column width={12}>
              <Field
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="Title"
                className={styles.titleInput}
              />
              <InputError name="title" />
              <div className={styles.commentEditor}>
                <ReactMde
                  value={body}
                  className={styles.markdownEditor}
                  onChange={setBody}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={renderPreview}
                />
              </div>
              <Button primary floated="right" type="submit" disabled={errors.issueTitle}>
                {isIssues ? 'Submit new issue' : 'Create pull request'}
              </Button>
            </Grid.Column>
            <Grid.Column width={4}>
              <div className={styles.sidebar}>
                <div className={styles.sidebarItem}>
                  <Dropdown
                    multiple
                    selection
                    fluid
                    options={labelOptions}
                    placeholder="Choose an option"
                    renderLabel={renderLabel}
                  />
                </div>
                <div className={styles.sidebarItem}>
                  <Dropdown
                    clearable
                    fluid
                    multiple
                    search
                    selection
                    options={assigneeOptions}
                    placeholder="Assignees"
                  />
                </div>
              </div>
            </Grid.Column>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

CreateIssuePrForm.propTypes = {
  isIssues: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CreateIssuePrForm;
