import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Form, Dropdown, Input, Radio, Checkbox, Divider, Button } from 'semantic-ui-react';
import { Formik, Field } from 'formik';
import Octicon, { getIconByName } from '@primer/octicons-react';
import { InputError } from '../../components/InputError';
import { createRepository, checkName } from '../../services/repositoryService';
import { getRelationUserOrg } from '../../services/orgService';
import * as elasticHelper from '../../helpers/elasticsearchHelper';
import * as Yup from 'yup';
import styles from './styles.module.scss';
import debounce from 'debounce-promise';

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

const validationSchema = Yup.object().shape({
  reponame: Yup.string()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Invalid repository name!')
    .required('Repository name is required!')
    .max(100, 'Maximum length - 100 characters')
});

const debouncedCheckName = debounce(checkName, 500);

class CreateRepository extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.renderCreateRepository = this.renderCreateRepository.bind(this);
    this.validate = this.validate.bind(this);

    this.state = {
      owner: '',
      ownerID: '',
      permission: true
    };
  }

  async validate(values) {
    let errors = {};
    const { exists } = await debouncedCheckName(values);
    if (exists) {
      errors.reponame = `The repository ${values.reponame} already exists on this account`;
    }
    if (Object.keys(errors).length) {
      throw errors;
    }
  }

  async onSubmit(values) {
    values.reponame = values.reponame.slice(0, 100);
    values.isPublic = values.privacy === 'public';
    const result = await createRepository({
      ...values
    });
    const { reponame, owner } = values;
    if (values.isPublic) {
      elasticHelper.addRepo(result.id, result.name, owner);
    }
    if (result.url) {
      this.props.history.push(`/${owner}/${reponame}`);
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
    const { owner, reponame, description, privacy, readme } = values;
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
        <p>A repository contains all project files, including the revision history.</p>
        <Divider section />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Field>
              <label>Owner</label>
              <Input name="owner" value={owner} onChange={handleChange} />
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
          <Button type="submit" color="blue" disabled={errors.reponame && touched.reponame}>
            Create repository
          </Button>
        </Form>
        <Divider hidden />
      </Container>
    );
  }

  async componentDidMount() {
    let { username: owner, id: ownerID, match } = this.props;
    const { orgname } = match.params;
    let permission = true;
    if (orgname) {
      const { result } = await getRelationUserOrg(orgname, ownerID);
      if (result) {
        const { orgId } = result;
        ownerID = orgId;
        owner = orgname;
      } else {
        permission = false;
      }
    }
    this.setState({
      ownerID,
      owner,
      permission
    });
  }

  render() {
    const { email, history } = this.props;
    const { owner, ownerID, permission } = this.state;
    if (!permission) history.push('/dashboard');

    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialValues,
          owner,
          email,
          ownerID
        }}
        validate={this.validate}
        validationSchema={validationSchema}
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
  history: PropTypes.any,
  match: PropTypes.object
};

const mapStateToProps = ({
  profile: {
    currentUser: { username, id, email }
  }
}) => ({ username, id, email });

export default connect(mapStateToProps)(CreateRepository);
