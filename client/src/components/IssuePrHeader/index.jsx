import React from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Input } from 'semantic-ui-react';

import styles from './styles.module.scss';

class IssuePrHeader extends React.Component {
  constructor(props) {
    super(props);

    const { title } = this.props;

    this.state = {
      title,
      initialValue: title,
      editing: false,
      isDisabled: true
    };

    this.onEdit = this.onEdit.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onTitleChange(ev) {
    const { value: title } = ev.target;

    const isDisabled = !title;
    this.setState({ ...this.state, title, isDisabled });
  }

  onEdit() {
    this.setState({ ...this.state, editing: true, initialValue: this.state.title });
  }

  onSave() {
    const result = this.props.onSubmit(this.state.title);
    if (result) {
      this.setState({ ...this.state, editing: false });
    }
  }

  onCancel() {
    this.setState({ ...this.state, editing: false, title: this.state.initialValue });
  }

  render() {
    const { canEdit, number, onNewIssue, isIssue } = this.props;
    const { editing, title, isDisabled } = this.state;
    return editing ? (
      <div className={styles.header_row}>
        <Input className={styles.input} tabIndex="1" autoFocus onChange={this.onTitleChange} value={this.state.title} />
        <Button compact primary content="Save" onClick={this.onSave} disabled={isDisabled} />
        <Button compact basic negative content="Cancel" onClick={this.onCancel} />
      </div>
    ) : (
      <div className={styles.header_row}>
        <Header as="h2" className={styles.issue_header}>
          {title}
          <span>{` #${number}`}</span>
        </Header>
        {canEdit ? <Button compact secondary basic content="Edit" onClick={this.onEdit} /> : null}
        {isIssue ? <Button compact positive content="New Issue" primary onClick={onNewIssue} /> : null}
      </div>
    );
  }
}

IssuePrHeader.propTypes = {
  title: PropTypes.string,
  canEdit: PropTypes.bool,
  number: PropTypes.number,
  onNewIssue: PropTypes.func,
  onSubmit: PropTypes.func,
  isIssue: PropTypes.bool
};

export default IssuePrHeader;
