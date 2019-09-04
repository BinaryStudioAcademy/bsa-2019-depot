import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Checkbox, Divider, Input } from 'semantic-ui-react';
import { Formik } from 'formik';
import Octicon, { Star, Repo } from '@primer/octicons-react';
import * as repositoryService from '../../services/repositoryService';

import styles from './styles.module.scss';

const MAX_PINNED_COUNT = 6;

class PinnableRepos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remaining: MAX_PINNED_COUNT,
      repositories: [],
      searchValue: ''
    };

    this.renderForm = this.renderForm.bind(this);
    this.validate = this.validate.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    const { username } = this.props;
    this.getRepositories(username);
  }

  async getRepositories(username) {
    const repositories = await repositoryService.getRepositories(username);
    this.setState({
      ...this.state,
      repositories
    });
  }

  filterRepositories(repositories, searchValue) {
    return repositories.filter(({ name }) => name.includes(searchValue));
  }

  onFilter(e, data) {
    this.setState({
      ...this.state,
      searchValue: data.value
    });
  }

  checkRepos(checked, repositories, remaining) {
    return repositories.map(repo => {
      if (remaining) {
        return { ...repo, disabled: false };
      }

      return checked.includes(repo.id) ? { ...repo, disabled: false } : { ...repo, disabled: true };
    });
  }

  validate(values) {
    const result = Object.entries(values)
      .map(([key, value]) => (value ? key : null))
      .filter(item => item);

    const remaining = MAX_PINNED_COUNT - result.length;
    const { repositories } = this.state;

    const checkedRepositories = this.checkRepos(result, repositories, remaining);

    this.setState({
      ...this.state,
      remaining,
      repositories: checkedRepositories
    });
  }

  renderTrigger() {
    return <button className={styles.trigger}>Customize your pins</button>;
  }

  renderItem({ id, name, disabled, starsCount }, handleChange) {
    return (
      <Form.Field key={name}>
        <Checkbox
          className={styles.pinnableItem}
          id={id}
          label={
            <label className={styles.repoLabel}>
              <span>
                <Octicon icon={Repo} />
                &nbsp;
                {name}
              </span>
              <span>
                {starsCount}&nbsp;
                <Octicon icon={Star} />
              </span>
            </label>
          }
          disabled={disabled}
          onChange={handleChange}
        />
      </Form.Field>
    );
  }

  async onSubmit(values) {
    console.warn(values);
  }

  renderForm({ errors, touched, handleChange, handleSubmit, values }) {
    const { repositories, remaining, searchValue } = this.state;
    const filteredRepos = this.filterRepositories(repositories, searchValue);

    return (
      <Form onSubmit={handleSubmit}>
        {filteredRepos.map(repo => this.renderItem(repo, handleChange))}
        <Divider />
        <div className={styles.formFooter}>
          <span className={!remaining ? styles.warning : ''}>{remaining} remaining</span>
          <Button type="submit" color="blue" disabled={errors.reponame && touched.reponame}>
            Save pins
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Modal trigger={this.renderTrigger()} size="tiny">
        <Modal.Header>
          <strong>Edit pinned items</strong>
          <br></br>
          Select up to six public repositories or gists you’d like to show.
        </Modal.Header>
        <Modal.Content>
          <Input placeholder="Filter repositories" fluid onChange={this.onFilter} />
          <Divider />
          <Formik onSubmit={this.onSubmit} render={this.renderForm} validate={this.validate} />
        </Modal.Content>
      </Modal>
    );
  }
}

PinnableRepos.propTypes = {
  username: PropTypes.string
};

export default PinnableRepos;
