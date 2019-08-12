import React from 'react';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

import { Container, Grid, Form, Button, Dropdown, Popup, Image } from 'semantic-ui-react';
import styles from './styles.module.scss';

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

class CreateIssuePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      selectedTab: 'write',
      isDisabled: true
    };

    this.onTitleChange = this.onTitleChange.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onTitleChange(evt) {
    const title = evt.target.value;
    const isDisabled = !title;
    this.setState({ ...this.state, title, isDisabled });
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
    const { title, body, selectedTab, isDisabled } = this.state;
    return (
      <Container>
        <Form className={styles.issueForm} onSubmit={this.onSubmit}>
          <Grid>
            <Grid.Column>
              <Popup
                content={'current user'}
                trigger={<Image avatar src="https://react.semantic-ui.com/images/wireframe/image.png" />}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <Form.Input value={title} onChange={this.onTitleChange} placeholder={'Title'} />
              <div className={styles.commentEditor}>
                <ReactMde
                  value={body}
                  onChange={this.onBodyChange}
                  selectedTab={selectedTab}
                  onTabChange={this.onTabChange}
                  generateMarkdownPreview={this.renderPreview}
                />
              </div>
              <Button color="green" floated="right" type="submit" disabled={isDisabled}>
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
      </Container>
    );
  }
}

export default CreateIssuePage;
