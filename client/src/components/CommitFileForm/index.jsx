import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Image, Segment, Radio } from 'semantic-ui-react';
import { InputError } from '../InputError';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

const CommitFileForm = ({ avatar, initialBranch, disabled, onSubmit, onCancel }) => {
  const validationSchema = Yup.object().shape({
    message: Yup.string()
      .required('Commit message is required')
      .max(200),
    commitBranch: Yup.string()
      .matches(/^\S*$/, 'Branch name is invalid')
      .required('Branch name is required')
      .max(100)
  });

  return (
    <div className={styles.commitFormContainer}>
      <Image src={getUserImgLink(avatar)} avatar />
      <Formik
        initialValues={{ message: '', commitBranch: initialBranch }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values: { message, commitBranch }, errors, isValid, handleChange, handleBlur, handleSubmit }) => (
          <Segment>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                name="message"
                value={message}
                placeholder="Enter commit message"
                disabled={disabled}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.message}
                fluid
              />
              <InputError name="message" />
              <Form.Field>
                <Radio
                  label={`Commit directly to the ${initialBranch} branch.`}
                  name="commitBranch"
                  id="initial-branch"
                  value={initialBranch}
                  checked={commitBranch === initialBranch}
                  disabled={disabled}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Create a new branch for this commit."
                  name="commitBranch"
                  id="new-branch"
                  checked={commitBranch !== initialBranch}
                  disabled={disabled}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {commitBranch !== initialBranch && (
                  <>
                    <Form.Input
                      icon="code branch"
                      iconPosition="left"
                      name="commitBranch"
                      value={commitBranch === initialBranch ? '' : commitBranch}
                      width={4}
                      disabled={disabled}
                      className={styles.branchInput}
                      error={!!errors.commitBranch}
                      placeholder="Enter new branch name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <InputError name="commitBranch" />
                  </>
                )}
              </Form.Field>
              <Button disabled={!isValid || disabled} type="submit" positive>
                Commit file
              </Button>
              <Button basic color="red" onClick={onCancel}>
                Cancel
              </Button>
            </Form>
          </Segment>
        )}
      </Formik>
    </div>
  );
};

CommitFileForm.propTypes = {
  avatar: PropTypes.string,
  initialBranch: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default CommitFileForm;
