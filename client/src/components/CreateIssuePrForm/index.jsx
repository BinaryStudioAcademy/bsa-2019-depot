import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { Field, Formik } from 'formik';
import { InputError } from '../InputError';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import * as Yup from 'yup';
import IssuePrSidebar from '../../containers/IssuePrSidebar';

import 'react-mde/lib/styles/css/react-mde-all.css';
import styles from './styles.module.scss';

const CreateIssuePrForm = ({ isIssues, onSubmit, repositoryId, labels }) => {
  const [selectedTab, setSelectedTab] = useState('write');
  const [body, setBody] = useState('');
  const [labelNames, setLabels] = useState('');

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Required')
      .max(256, 'Maximum length - 256 characters')
  });

  function renderPreview() {
    return Promise.resolve(<ReactMarkdown source={body} />);
  }

  function updateLabelNames(labelNames){
    setLabels(labelNames);
  }

  function handleSubmit({ title }) {
    onSubmit(title, body, labelNames);
  }

  return (
    <Segment basic>
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
                <IssuePrSidebar isIssue={isIssues} repositoryId={repositoryId} labels={labels} setLabelsOnCreateItem={updateLabelNames}/>
              </Grid.Column>
            </Grid>
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

CreateIssuePrForm.propTypes = {
  isIssues: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  repositoryId: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired
};

export default CreateIssuePrForm;
