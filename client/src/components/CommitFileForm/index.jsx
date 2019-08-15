import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Form, Image, Segment, Radio } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

const CommitFileForm = ({ avatar, initialBranch, disabled, onSubmit, onCancel }) => {
  return (
    <div className={styles.commitFormContainer}>
      <Image src={getUserImgLink(avatar)} avatar />
      <Formik initialValues={{ message: '', branch: initialBranch }} onSubmit={onSubmit}>
        {({ values: { message, branch }, handleChange, handleSubmit }) => (
          <Segment>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                name="message"
                value={message}
                placeholder="Enter commit message"
                disabled={disabled}
                onChange={handleChange}
                fluid
              />
              <Form.Field>
                <Radio
                  label={`Commit directly to the ${initialBranch} branch.`}
                  name="branch"
                  id="initial-branch"
                  value={initialBranch}
                  checked={branch === initialBranch}
                  disabled={disabled}
                  onChange={handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Create a new branch for this commit."
                  name="branch"
                  id="new-branch"
                  checked={branch !== initialBranch}
                  disabled={disabled}
                  onChange={handleChange}
                />
                {branch !== initialBranch && (
                  <Form.Input
                    icon="code branch"
                    iconPosition="left"
                    name="branch"
                    value={branch === initialBranch ? '' : branch}
                    width={4}
                    className={styles.branchInput}
                    placeholder="Enter new branch name"
                    onChange={handleChange}
                  />
                )}
              </Form.Field>
              <Button disabled={!message || disabled} type="submit" positive>
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
