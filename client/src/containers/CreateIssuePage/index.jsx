import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { createIssue, fetchCurrentRepo } from '../../routines/routines';
import * as Yup from 'yup';
import { Container, Grid, Button, Dropdown, Form } from 'semantic-ui-react';
import { Formik, Field } from 'formik';
import styles from './styles.module.scss';
import { InputError } from '../../components/InputError';

// labels mock
const labelOptions = [
  { key: 1, text: 'One', value: 1, color: 'red' },
  { key: 2, text: 'Two', value: 2, color: 'green' },
  { key: 3, text: 'Three', value: 3, color: 'blue' }
];

//assignees mock
const assigneeOptions = [
  { key: 'af', value: 'af', text: 'John Doe' },
  { key: 'ax', value: 'ax', text: 'Alanda Java' },
  { key: 'al', value: 'al', text: 'Ivan Fortran' },
  { key: 'dz', value: 'dz', text: 'Michael Algol' }
];

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Required')
    .max(256, 'Maximum length - 256 characters')
});

class CreateIssuePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      selectedTab: 'write'
    };

    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {
      repositoryId,
      fetchCurrentRepo,
      match: {
        params: { reponame, username }
      }
    } = this.props;
    if (!repositoryId) {
      fetchCurrentRepo({ username, reponame });
    }
  }

  onBodyChange(body) {
    this.setState({ ...this.state, body });
  }

  onTabChange(selectedTab) {
    this.setState({ ...this.state, selectedTab });
  }

  renderPreview(markdown) {
    return Promise.resolve(<ReactMarkdown source={markdown} />);
  }

  onSubmit({ title }) {
    const { body } = this.state;
    const {
      createIssue,
      repositoryId,
      userId,
      history,
      match: { url }
    } = this.props;

    createIssue({
      title,
      body,
      userId,
      repositoryId,
      isOpened: true
    });
    const newUrl = url
      .split('/')
      .slice(0, -1)
      .join('/');
    history.push(newUrl);
  }

  renderLabel = label => ({
    color: label.color,
    content: label.text
  });

  render() {
    const { body, selectedTab } = this.state;
    return (
      <Container>
        <Formik onSubmit={this.onSubmit} validationSchema={validationSchema}>
          {({ values: { title }, errors, handleChange, handleSubmit }) => (
            <Form className={styles.issueForm} onSubmit={handleSubmit}>
              <Grid>
                <Grid.Column></Grid.Column>
                <Grid.Column width={10}>
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
                      onChange={this.onBodyChange}
                      selectedTab={selectedTab}
                      onTabChange={this.onTabChange}
                      generateMarkdownPreview={this.renderPreview}
                    />
                  </div>
                  <Button color="green" floated="right" type="submit" disabled={errors.issueTitle}>
                    Submit new issue
                  </Button>
                </Grid.Column>
                <Grid.Column width={5}>
                  <div className={styles.sidebar}>
                    <div className={styles.sidebarItem}>
                      <Dropdown
                        multiple
                        selection
                        fluid
                        options={labelOptions}
                        placeholder="Choose an option"
                        renderLabel={this.renderLabel}
                      />
                    </div>
                    <div className={styles.sidebarItem}>
                      <Dropdown
                        clearable
                        fluid
                        multiple
                        search
                        selection
                        options={assigneeOptions}
                        placeholder="Assignees"
                      />
                    </div>
                  </div>
                </Grid.Column>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    );
  }
}

CreateIssuePage.propTypes = {
  username: PropTypes.string.isRequired,
  reponame: PropTypes.string,
  issues: PropTypes.array.isRequired,
  repositoryId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  createIssue: PropTypes.func.isRequired,
  fetchCurrentRepo: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.exact({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId, username }
  },
  issuesData: { issues },
  currentRepo: {
    repository: {
      currentRepoInfo: { id, name }
    }
  }
}) => ({
  userId,
  username,
  issues,
  reponame: name,
  repositoryId: id
});

const mapDispatchToProps = {
  createIssue,
  fetchCurrentRepo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIssuePage);
