import React from 'react';
import PropTypes from 'prop-types';
import { List, Button, Label, Form, Grid } from 'semantic-ui-react';
import { Formik } from 'formik';
import { InputError } from '../../components/InputError';
import * as Yup from 'yup';
import ColorPicker from '../../components/ColorPicker';
import Color from 'color';

import styles from './styles.module.scss';

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
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.changeTextColor = this.changeTextColor.bind(this);
  }

  componentDidMount(props) {
    const { labelObject } = this.props;
    const newLabel = Boolean(!labelObject.id);
    if (newLabel) {
      this.setState({
        ...this.state,
        isEditing: true
      });
    }
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
    this.props.cancelCreateLabel();
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

  async handleKeyUp({ target }) {
    const targetName = target.getAttribute('name');
    const value = target.getAttribute('value');
    await this.setState({
      ...this.state,
      [targetName]: value
    });
  }

  handleChangeColor(color) {
    this.setState({ color });
  }

  renderEditForm() {
    const { isEditing, name, description, color } = this.state;
    const { labelObject } = this.props;
    const isNewLabel = !labelObject.id;
    const submitButtonText = isNewLabel ? 'Create Label' : 'Save Changes';
    return isEditing ? (
      <Formik
        isInitialValid={Boolean(labelObject.id)}
        enableReinitialize={false}
        initialValues={{ name, description, color }}
        onSubmit={this.finishEditing}
        validationSchema={validationSchema}
      >
        {({ isValid, touched, values, handleChange, handleBlur, handleSubmit, errors, setFieldValue }) => {
          return (
            <Form className={styles.labelForm} onSubmit={handleSubmit}>
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
                  onKeyUp={this.handleKeyUp}
                />
                <Form.Input
                  label="Description"
                  name="description"
                  value={values.description}
                  placeholder="Optional description"
                  width={5}
                  className={styles.labelInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.description}
                  fluid
                  onKeyUp={this.handleKeyUp}
                />
                <Form.Input
                  label="Enter color hex value"
                  name="color"
                  value={values.color}
                  placeholder="Color"
                  width={3}
                  className={styles.labelInput}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.color}
                  fluid
                  onKeyUp={this.handleKeyUp}
                />
                <ColorPicker color={color} handleChangeColor={this.handleChangeColor} setFieldValue={setFieldValue} />
                <div className={styles.editButtons} width={2} floated="right">
                  <Button basic content="Cancel" onClick={this.cancelEditing} />
                  <Button type="submit" disabled={!isValid} color="blue" content={submitButtonText} />
                </div>
              </Form.Group>
              <Grid>
                <Grid.Row className={styles.errorFields}>
                  <Grid.Column width={3}>
                    <InputError name="name" />
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <InputError name="description" />
                  </Grid.Column>
                  <Grid.Column width={3}>
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

  changeTextColor(labelColor) {
    return Color(labelColor).isDark() ? '#f7f7fb' : '#363a44';
  }

  render() {
    const { labelObject } = this.props;
    const isNewLabel = !labelObject.id;
    const { isEditing, name, color } = this.state;
    const labelText = isEditing ? name || 'Label Preview' : labelObject.name;
    const labelColor = isEditing && color.match(/^#[0-9a-fA-F]{6}$/) ? color : labelObject.color;
    const textColor = labelColor && this.changeTextColor(labelColor);

    return (
      <>
        <List.Item className={styles.labelItem}>
          {isNewLabel && !isEditing ? null : (
            <List.Content floated="left" className={styles.leftGroup}>
              <div className={styles.nameContainer}>
                <Label
                  horizontal
                  style={{ backgroundColor: labelColor, color: textColor }}
                  className={styles.labelName}
                >
                  {labelText}
                </Label>
              </div>
              <div className={styles.labelDescription}>{isEditing ? '' : labelObject.description}</div>
            </List.Content>
          )}
          {isNewLabel ? null : (
            <List.Content floated="right" className={styles.labelButtons}>
              <Button icon="pencil alternate" className={styles.actionButton} onClick={this.startEditing} />
              <Button icon="times" className={styles.actionButton} onClick={this.handleDelete} />
            </List.Content>
          )}
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
  onEdit: PropTypes.func,
  cancelCreateLabel: PropTypes.func
};

export default LabelItem;
