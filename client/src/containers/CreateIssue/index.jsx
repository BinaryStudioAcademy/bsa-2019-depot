import React from 'react';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import * as Yup from 'yup';

import { Container, Grid, Button, Dropdown, Form, Popup, Image } from 'semantic-ui-react';
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
  issueTitle: Yup.string().max(256, 'Maximum length - 256 characters')
});

class CreateIssuePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      selectedTab: 'write'
    };

    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  onSubmit() {}

  renderLabel = label => ({
    color: label.color,
    content: label.text
  });

  render() {
    const { body, selectedTab } = this.state;
    return (
      <Container>
        <Formik onSubmit={this.onSubmit} validationSchema={validationSchema}>
          {({ errors, handleChange, issueTitle }) => (
            <Form className={styles.issueForm} onSubmit={this.onSubmit}>
              <Grid>
                <Grid.Column>
                  <Popup
                    content={'current user'}
                    trigger={<Image avatar src="https://react.semantic-ui.com/images/wireframe/image.png" />}
                  />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Field
                    name="issueTitle"
                    value={issueTitle}
                    onChange={handleChange}
                    placeholder="Title"
                    className={styles.titleInput}
                  />
                  <InputError name="issueTitle" />
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

export default CreateIssuePage;
