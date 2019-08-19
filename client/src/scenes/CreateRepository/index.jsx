import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Form, Dropdown, Input, Radio, Checkbox, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { InputError } from '../../components/InputError';
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
  ownerID: '',
  reponame: '',
  description: '',
  privacy: 'public',
  readme: false,
  gitignore: false,
  license: false
};

class CreateRepository extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.renderCreateRepository = this.renderCreateRepository.bind(this);
    this.validate = this.validate.bind(this);
  }

  async validate(values) {
    let errors = {};
    if (!values.reponame) {
      errors.reponame = 'Required';
    }
    const { exists } = await checkName(values);
    if (exists) {
      errors.reponame = `The repository ${values.reponame} already exists on this account`;
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  }

  async onSubmit(values) {
    const result = await createRepository({
      ...values
    });
    const { reponame, owner } = values;
    if (result.url) {
      this.props.history.push(`${owner}/${reponame}`);
    }
  }

  handleChangeDropdown = handleChange => (e, data) => {
    const { value, options } = data;
    e.target.value = value;
    e.target.id = options[0].id;
    handleChange(e);
  };

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

  renderCreateRepository({ errors, touched, handleChange, handleSubmit, values }) {
    const { username } = this.props;
    const { reponame, description, privacy, readme } = values;
    const handleChangeDropdown = this.handleChangeDropdown(handleChange);

    const ignores = gitingnoreOptions.map(option => {
      option.id = 'gitignore';
      return option;
    });
    const licenses = licenseOptions.map(option => {
      option.id = 'license';
      return option;
    });

    return (
      <Container>
        <Divider hidden />
        <h1 className={styles.title}>Create a new repository</h1>
        <p>
          A repository contains all project files, including the revision history. Already have a project repository
          elsewhere?
        </p>
        <Link to="/">Import a repository.</Link>
        <Divider section />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field>
              <label>Owner</label>
              <Input name="owner" value={username} onChange={handleChange} />
            </Form.Field>
            <span className={styles.slash}>/</span>
            <Form.Field className={styles.formField}>
              <label>Repository name</label>
              <Field name="reponame" value={reponame} onChange={handleChange} className={styles.reponameInput} />
              <InputError name="reponame" />
            </Form.Field>
          </Form.Group>
          <p>Great repository names are short and memorable. Need inspiration? How about psychic-eureka?</p>
          <Form.Field>
            <label>
              Description <small>(optional)</small>
            </label>
            <Input name="description" value={description} onChange={handleChange} />
          </Form.Field>
          <Divider />
          <div>
            <Form.Field>
              <Radio
                label={this.renderPrivacyLabelPublic()}
                id="public"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label={this.renderPrivacyLabelLock()}
                id="private"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={handleChange}
              />
            </Form.Field>
            <Divider />
          </div>
          <Form.Field>
            <label name="readme"></label>
            <Checkbox
              id="readme"
              label={<label name="readme">Initialize this repository with a README</label>}
              checked={readme}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Group>
            <Form.Field>
              <label>Add .gitignore:</label>
              <Dropdown selection options={ignores} defaultValue={ignores[0].value} onChange={handleChangeDropdown} />
            </Form.Field>
            <Form.Field>
              <label>Add a license:</label>
              <Dropdown selection options={licenses} defaultValue={licenses[0].value} onChange={handleChangeDropdown} />
            </Form.Field>
          </Form.Group>
          <Divider />
          <Button type="submit" color="green" disabled={errors.reponame && touched.reponame}>
            Create repository
          </Button>
        </Form>
        <Divider hidden />
      </Container>
    );
  }

  render() {
    return (
      <Formik
        initialValues={{
          ...initialValues,
          owner: this.props.username,
          email: this.props.email,
          ownerID: this.props.id
        }}
        validate={this.validate}
        onSubmit={this.onSubmit}
        render={this.renderCreateRepository}
      />
    );
  }
}

CreateRepository.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  history: PropTypes.any
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, id, email }
  }
}) => ({ username, id, email });

export default connect(mapStateToProps)(CreateRepository);
