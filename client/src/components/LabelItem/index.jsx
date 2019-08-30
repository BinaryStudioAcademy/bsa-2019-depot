import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Label, Form, Grid } from 'semantic-ui-react';
import { Formik, Field } from 'formik';
import { InputError } from '../../components/InputError';
import * as Yup from 'yup';

import styles from './styles.module.scss';
// import { renderers } from 'react-markdown';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Label name is required')
    .max(50, 'Maximum length is 50 characters'),
  description: Yup.string().max(100, 'Maximum length is 100 characters'),
  color: Yup.string()
    .required('Color is required')
    .matches(/^#[0-9a-fA-F]{6}$/, 'Color starts with # followed by 6 characters (digits and letters a-f)')
});

class LabelItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      name: '',
      description: '',
      color: ''
    };

    this.startEditing = this.startEditing.bind(this);
    this.finishEditing = this.finishEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.passChangeToState = this.passChangeToState.bind(this);
  }

  handleDelete() {
    const { labelObject, onDelete } = this.props;
    onDelete(labelObject.id);
  }

  startEditing() {
    const { name, description, color } = this.props.labelObject;
    this.setState({
      ...this.state,
      isEditing: true,
      name,
      description,
      color
    });
  }

  cancelEditing() {
    this.setState({
      ...this.state,
      isEditing: false,
      name: '',
      description: '',
      color: ''
    });
  }

  finishEditing() {
    const { name, color, description } = this.state;
    const { labelObject, onEdit } = this.props;
    const newLabelObject = {
      id: labelObject.id,
      name,
      color,
      description
    };
    onEdit(newLabelObject);
    this.setState({
      ...this.state,
      isEditing: false,
      name: '',
      description: '',
      color: ''
    });
  }

  async passChangeToState({ name, color, description }) {
    await this.setState({
      ...this.state,
      name,
      color,
      description
    });
  }

  renderEditForm() {
    const { isEditing, name, description, color } = this.state;
    return isEditing ? (
      <Formik
        isInitialValid
        enableReinitialize={false}
        initialValues={{ name, description, color }}
        onSubmit={this.finishEditing}
        validationSchema={validationSchema}
      >
        {({ isValid, touched, values, handleChange, handleBlur, handleSubmit, errors }) => {
          return (
            <Form className={styles.labelForm} onSubmit={handleSubmit} onChange={() => this.passChangeToState(values)}>
              <Form.Group>
                <Form.Input
                  label="Name"
                  name="name"
                  value={values.name}
                  placeholder="New label name..."
                  width={3}
                  className={styles.labelInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.name}
                  fluid
                />
                <Form.Input
                  label="Description"
                  name="description"
                  value={values.description}
                  placeholder="Oprional description"
                  width={6}
                  className={styles.labelInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.description}
                  fluid
                />
                <Form.Input
                  label="Color"
                  name="color"
                  value={values.color}
                  placeholder="Color"
                  width={2}
                  className={styles.labelInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.color}
                  fluid
                />
                <div className={styles.editButtons} width={2} floated="right">
                  <Button basic content="Cancel" onClick={this.cancelEditing} />
                  <Button type="submit" disabled={!isValid && touched} color="blue" content="Save Changes" />
                </div>
              </Form.Group>
              <Grid>
                <Grid.Row className={styles.errorFields}>
                  <Grid.Column width={3}>
                    <InputError name="name" />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <InputError name="description" />
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <InputError name="color" />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    ) : null;
  }

  render() {
    const { labelObject } = this.props;
    const { isEditing, name, color } = this.state;
    const labelText = isEditing ? name || 'Label Preview' : labelObject.name;
    const labelColor = isEditing && color.match(/^#[0-9a-fA-F]{6}$/) ? color : labelObject.color;
    console.log(labelColor);

    return (
      <>
        <List.Item className={styles.labelItem}>
          <List.Content floated="left" className={styles.leftGroup}>
            <div className={styles.nameContainer}>
              <Label horizontal style={{ backgroundColor: labelColor }} className={styles.labelName}>
                {labelText}
              </Label>
            </div>
            <div className={styles.labelDescription}>{isEditing ? '' : labelObject.description}</div>
          </List.Content>
          <List.Content floated="right" className={styles.labelButtons}>
            <Button
              content="Edit"
              icon="pencil alternate"
              className={styles.actionButton}
              onClick={this.startEditing}
            />
            <Button content="Delete" icon="times" className={styles.actionButton} onClick={this.handleDelete} />
          </List.Content>
        </List.Item>
        {this.renderEditForm()}
      </>
    );
  }
}

LabelItem.propTypes = {
  labelObject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    color: PropTypes.string.isRequired
  }),
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default LabelItem;
