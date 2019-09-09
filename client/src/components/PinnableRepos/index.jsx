import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Checkbox, Divider, Input } from 'semantic-ui-react';
import { Formik } from 'formik';
import Octicon, { Star, Repo } from '@primer/octicons-react';
import * as repositoryService from '../../services/repositoryService';
import * as userService from '../../services/userService';

import styles from './styles.module.scss';

const MAX_PINNED_COUNT = 6;

class PinnableRepos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      remaining: MAX_PINNED_COUNT,
      repositories: [],
      searchValue: '',
      loading: true,
      modalOpen: false
    };

    this.renderForm = this.renderForm.bind(this);
    this.validate = this.validate.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.getPublicOnlyRepositories = this.getPublicOnlyRepositories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async getPublicOnlyRepositories() {
    const { username } = this.props;
    const repositories = await repositoryService.getPublicOnlyRepositories(username);

    this.setState({
      repositories,
      loading: false
    });
  }

  get initialValues() {
    const { pinnedRepos } = this.props;
    if (!pinnedRepos) {
      return {};
    }

    const initialValues = {};
    pinnedRepos.forEach(({ repository: { id } }) => (initialValues[id] = true));
    return initialValues;
  }

  filterRepositories(repositories, searchValue) {
    return repositories.filter(({ name }) => name.includes(searchValue));
  }

  onFilter(e, data) {
    this.setState({
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

  mapResult(values) {
    return Object.entries(values)
      .map(([key, value]) => (value ? key : null))
      .filter(item => item);
  }

  validate(values) {
    const result = this.mapResult(values);

    const remaining = MAX_PINNED_COUNT - result.length;
    const { repositories } = this.state;

    const checkedRepositories = this.checkRepos(result, repositories, remaining);

    this.setState({
      remaining,
      repositories: checkedRepositories
    });
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  renderTrigger() {
    return (
      <button className={styles.trigger} onClick={this.handleOpen}>
        Customize your pins
      </button>
    );
  }

  async onSubmit(values) {
    const { userId } = this.props;
    const repositories = this.mapResult(values);
    userService.setPinnedRepos({ userId, repositories });

    this.handleClose();
    this.props.onSetPinned();
  }

  renderItem({ id, name, disabled, starsCount }, handleChange, checked) {
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
          checked={checked}
        />
      </Form.Field>
    );
  }

  renderForm({ errors, touched, handleChange, handleSubmit, values }) {
    const { repositories, remaining, searchValue, loading } = this.state;
    const filteredRepos = this.filterRepositories(repositories, searchValue);

    return (
      <Form onSubmit={handleSubmit} loading={loading}>
        {filteredRepos.map(repo => this.renderItem(repo, handleChange, values[repo.id]))}
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
    const { modalOpen, searchValue } = this.state;
    return (
      <Modal
        trigger={this.renderTrigger()}
        open={modalOpen}
        onOpen={this.getPublicOnlyRepositories}
        onClose={this.handleClose}
        size="tiny"
      >
        <Modal.Header>
          Edit pinned items
          <br></br>
          <span className={styles.normalFont}>Select up to six public repositories or gists you’d like to show.</span>
        </Modal.Header>
        <Modal.Content>
          <Input placeholder="Filter repositories" fluid onChange={this.onFilter} value={searchValue} />
          <Divider />
          <Formik
            onSubmit={this.onSubmit}
            render={this.renderForm}
            validate={this.validate}
            initialValues={this.initialValues}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = ({
  profile: {
    currentUser: { id: userId }
  }
}) => ({ userId });

PinnableRepos.propTypes = {
  username: PropTypes.string,
  userId: PropTypes.string,
  onSetPinned: PropTypes.func,
  pinnedRepos: PropTypes.array
};

export default connect(mapStateToProps)(PinnableRepos);
