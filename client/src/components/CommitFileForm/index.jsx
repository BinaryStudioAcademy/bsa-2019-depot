import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form, Image, Segment, Radio } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

const CommitFileForm = ({ avatar, initialBranch, handleSubmit }) => {
  return (
    <div className={styles.commitFormContainer}>
      <Image src={getUserImgLink(avatar)} avatar />
      <Formik initialValues={{ message: '', branch: initialBranch }} onSubmit={handleSubmit}>
        {({ values: { message, branch }, handleChange }) => (
          <Segment>
            <Form>
              <Form.Input name="message" value={message} placeholder="Enter commit message" fluid />
              <Form.Field>
                <Radio
                  label={`Commit directly to the ${initialBranch} branch.`}
                  name="branch"
                  id="initial-branch"
                  value={initialBranch}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Create a new branch for this commit."
                  name="branch"
                  id="new-branch"
                  value={branch}
                  onChange={handleChange}
                />
                {branch !== initialBranch && (
                  <Form.Input
                    icon="code branch"
                    iconPosition="left"
                    name="branch"
                    value={branch}
                    width={4}
                    className={styles.branchInput}
                    placeholder="Enter new branch name"
                    onChange={handleChange}
                  />
                )}
              </Form.Field>
            </Form>
          </Segment>
        )}
      </Formik>
    </div>
  );
};

CommitFileForm.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  initialBranch: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default CommitFileForm;
