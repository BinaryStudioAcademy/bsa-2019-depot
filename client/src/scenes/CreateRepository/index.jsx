import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Form, Dropdown, Input, Radio, Checkbox, Divider, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { createRepository, checkName } from '../../services/repositoryService';
import styles from './styles.module.scss';

const gitingnoreOptions = [
  {
    key: 'None',
    text: 'None',
    value: 'None'
  },
  {
    key: 'Actionscript',
    text: 'Actionscript',
    value: 'Actionscript'
  }
];

const licenseOptions = [
  {
    key: 'None',
    text: 'None',
    value: 'None'
  },
  {
    key: 'Apache License 2.0',
    text: 'Apache License 2.0',
    value: 'Apache License 2.0'
  }
];

const initialValues = {
  owner: '',
  repository: '',
  description: '',
  privacy: 'public',
  readme: false
};

class CreateRepository extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.renderCreateRepository = this.renderCreateRepository.bind(this);
    this.validateRepoName = this.validateRepoName.bind(this);
  }

  componentDidMount() {
    this.setState({
      values: {
        ...initialValues,
        owner: this.props.username
      }
    });
  }

  async validateRepoName(values) {
    if (!values.repository) {
      return 'Required';
    }
    const { exists } = await checkName(values);
    if (exists) {
      return `The repository ${values.repository} already exists on this account`;
    }
  }


  onSubmit(values) {
    createRepository({
      ...values,
      owner: this.props.username
    });
    const { repository } = this.state.values;
    const owner = this.props.username;
    this.props.history.push(`${owner}/${repository}`);
  }

  renderPrivacyLabelPublic() {
    return (
      <label name="public" className={styles.privacyLabel}>
        <Octicon className={styles.privacyIcon} icon={getIconByName('repo')} />
        <span>
          Public
          <small>Anyone can see this repository. You choose who can commit.</small>
        </span>
      </label>
    );
  }

  renderPrivacyLabelLock() {
    return (
      <label name="private" className={styles.privacyLabel}>
        <Octicon className={styles.privacyIcon} icon={getIconByName('lock')} />
        <span>
          Private
          <small>You choose who can see and commit to this repository.</small>
        </span>
      </label>
    );
  }

  renderCreateRepository({
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    values
  }) {
    const { username } = this.props;
    const { repository, description, readme, privacy } = values;

    return (
      <Container>
        <h1>Create a new repository</h1>
        <p>A repository contains all project files, including the revision history. Already have a project repository elsewhere?</p>
        <Link to="/">Import a repository.</Link>
        <Divider section />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field>
              <label>Owner</label>
              <Input
                name="owner"
                value={username}
                onChange={handleChange}
              />
            </Form.Field>
            <span className={styles.slash}>/</span>
            <Form.Field className={styles.formField}>
              <label>Repository name</label>
              <Field
                name="repository"
                value={repository}
                // eslint-disable-next-line react/jsx-no-bind
                validate={() => this.validateRepoName(values)}
                onChange={handleChange}
              />
              {(errors.repository && touched.repository &&
                <span className={styles.label}>
                  <Label
                    basic
                    color='red'
                    pointing
                  >
                    {errors.repository}
                  </Label>
                </span>
              )}
            </Form.Field>

          </Form.Group>
          <p>Great repository names are short and memorable. Need inspiration? How about psychic-eureka?</p>
          <Form.Field>
            <label>Description <small>(optional)</small></label>
            <Input
              name="description"
              value={description}
              onChange={handleChange}
            />
          </Form.Field>
          <Divider />
          <div>
            <Form.Field>
              <Radio
                label={this.renderPrivacyLabelPublic()}
                id='public'
                name='privacy'
                value='public'
                checked={privacy === 'public'}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label={this.renderPrivacyLabelLock()}
                id='private'
                name='privacy'
                value='private'
                checked={privacy === 'private'}
                onChange={handleChange}
              />
            </Form.Field>
            <Divider />
          </div>
          <Form.Field>
            <label name={readme}></label>
            <Checkbox
              id='readme'
              label={<label name="readme">Initialize this repository with a README</label>}
              value={readme}
              checked={readme}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Add .gitignore:</label>
              <Dropdown
                selection
                options={gitingnoreOptions}
                defaultValue={gitingnoreOptions[0].value}
              />
            </Form.Field>
            <Form.Field>
              <label>Add a license:</label>
              <Dropdown
                selection
                options={licenseOptions}
                defaultValue={licenseOptions[0].value}
              />
            </Form.Field>
          </Form.Group>
          <Divider />
          <Button
            type='submit'
            color='green'
          >
            Create repository
          </Button>
        </Form>
      </Container>
    );
  }

  render() {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        render={this.renderCreateRepository}
      />
    );
  }
}

CreateRepository.propTypes = {
  username: PropTypes.string.isRequired,
  history: PropTypes.any
};

const mapStateToProps = (state) => {
  return {
    username: state.profile.username
  };
};

export default connect(mapStateToProps)(CreateRepository);
