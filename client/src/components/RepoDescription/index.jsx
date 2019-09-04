import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button } from 'semantic-ui-react';
import { InputError } from '../../components/InputError';

import styles from './styles.module.scss';

const RepoDescription = props => {
  const [edit, setEdit] = useState(false);
  const { description, website, isOwn, onSubmit } = props;

  const infoValidationSchema = Yup.object().shape({
    description: Yup.string(),
    website: Yup.string()
      .url('Invalid URL')
      .max(255)
  });

  function toggleEdit() {
    setEdit(!edit);
  }

  let infoContent, descriptionContent, websiteContent;
  if (!(description || website)) {
    infoContent = <i>No description or website provided</i>;
  } else {
    if (description) {
      descriptionContent = description;
    }
    if (website) {
      websiteContent = (
        <a className={styles.link} href={website}>
          {website}
        </a>
      );
    }
    infoContent = (
      <>
        {descriptionContent}
        {websiteContent}
      </>
    );
  }

  return (
    <div className={styles.repoDescription}>
      {edit ? (
        <Formik
          initialValues={{
            description: description || '',
            website: website || ''
          }}
          validationSchema={infoValidationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Input
                name="description"
                placeholder="Short description"
                label="Description"
                error={!!errors.description}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <InputError name="description" />
              <Form.Input
                name="website"
                placeholder="Website"
                label="Website"
                width={7}
                error={!!errors.website}
                value={values.website}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <InputError name="website" />
              <Button
                type="submit"
                disabled={errors.description || errors.website}
                className={[styles.actionButton, styles.saveButton].join(' ')}
              >
                Save
              </Button>
              <Button onClick={toggleEdit} className={styles.actionButton}>
                Cancel
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <div className={styles.repoDescriptionText}>{infoContent}</div>
          {isOwn && (
            <Button secondary className={styles.editButton} onClick={toggleEdit}>
              Edit
            </Button>
          )}
        </>
      )}
    </div>
  );
};

RepoDescription.propTypes = {
  isOwn: PropTypes.bool.isRequired,
  description: PropTypes.string,
  website: PropTypes.string,
  onSubmit: PropTypes.func
};

export default RepoDescription;
