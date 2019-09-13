import React from 'react';
import PropTypes from 'prop-types';
import Octicon, { Comment, RequestChanges, Check, PrimitiveDot } from '@primer/octicons-react';
import { Divider, Dropdown } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

class IssuePrSidebar extends React.Component {
  constructor(props) {
    super(props);

    const { currentLabels, currentAssignees, reviewers } = this.props;

    this.state = {
      currentLabels,
      currentAssignees,
      reviewers
    };

    this.onPropChange = this.onPropChange.bind(this);
    this.onChangeReviewers = this.onChangeReviewers.bind(this);
    this.onChangeAssignees = this.onChangeAssignees.bind(this);
    this.renderReviewerLabel = this.renderReviewerLabel.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  onPropChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  onChangeLabels = async (event, { value }) => {
    const { setLabelsOnCreateItem, setLabels } = this.props;
    if (setLabelsOnCreateItem) {
      setLabelsOnCreateItem(value);
    } else {
      setLabels(value);
    }
  };

  onChangeAssignees = async (event, { value }) => {
    const { setAssigneesOnCreateItem, setAssignees } = this.props;
    if (setAssigneesOnCreateItem) {
      setAssigneesOnCreateItem(value);
    } else {
      setAssignees(value);
    }
  };

  onChangeReviewers(event, { value }) {
    const { collaborators, setReviewerToPull, removeReviewerFromPull, setReviewersOnCreateItem } = this.props;
    const { reviewers } = this.state;

    const newNumOfReviewers = value.length;

    if (setReviewersOnCreateItem) {
      setReviewersOnCreateItem(value);
    } else {
      if (newNumOfReviewers < reviewers.length) {
        const deletedReviewerIdx = reviewers.findIndex(({ user: { username } }) => !value.includes(username));
        removeReviewerFromPull(reviewers[deletedReviewerIdx].id).then(() => {
          reviewers.splice(deletedReviewerIdx, 1);
          this.setState({ reviewers });
        });
      } else {
        const { userId } = collaborators.find(({ user: { username } }) => username === value[newNumOfReviewers - 1]);
        setReviewerToPull(userId).then(result => {
          reviewers.push(result);
          this.setState({ reviewers });
        });
      }
    }
  }

  renderReviewerLabel(label) {
    const reviewer = this.state.reviewers.find(({ user: { username } }) => username === label.text);
    const statusName = reviewer ? reviewer.status.name : 'PENDING';

    let labelColor, labelIcon;
    switch (statusName) {
    case 'PENDING':
      labelColor = 'yellow';
      labelIcon = <Octicon icon={PrimitiveDot} />;
      break;
    case 'COMMENTED':
      labelIcon = <Octicon icon={Comment} />;
      break;
    case 'APPROVED':
      labelColor = 'green';
      labelIcon = <Octicon icon={Check} />;
      break;
    case 'CHANGES REQUESTED':
      labelColor = 'red';
      labelIcon = <Octicon icon={RequestChanges} />;
      break;
    default:
      labelColor = 'yellow';
      labelIcon = <Octicon icon={PrimitiveDot} />;
      break;
    }

    return {
      content: (
        <>
          {labelIcon}
          {label.text}
        </>
      ),
      className: 'optionLabel',
      color: labelColor
    };
  }

  renderLabel(label) {
    return {
      content: label.text,
      className: 'optionLabel'
    };
  }

  render() {
    const { isIssue, collaborators, labels, assignees } = this.props;
    const { currentLabels, reviewers, currentAssignees } = this.state;
    let defaultLabelValues = null;
    if (currentLabels) {
      defaultLabelValues = currentLabels.map(({ label }) => label.id);
    }

    let reviewerOptions;
    if (!isIssue) {
      reviewerOptions = collaborators.map(({ id, user: { username, imgUrl } }) => ({
        key: id,
        text: username,
        value: username,
        image: { avatar: true, src: getUserImgLink(imgUrl) }
      }));
    }

    let assigneeOptions;
    if (isIssue) {
      assigneeOptions = assignees
        ? assignees.map(({ id, username, imgUrl }) => ({
          key: id,
          text: username,
          value: username,
          image: { avatar: true, src: getUserImgLink(imgUrl) }
        }))
        : [];
    }

    const labelOptions = labels.map(({ id, name, description, color }) => ({
      key: id,
      text: name,
      value: id,
      content: (
        <>
          <div className={styles.labelName}>
            <span className={styles.labelColor} style={{ backgroundColor: color }} /> {name}
          </div>
          <div>{description}</div>
        </>
      )
    }));

    return (
      <>
        {!isIssue && (
          <>
            <h5 className={styles.sectionHeader}>Reviewers</h5>
            <Dropdown
              options={reviewerOptions}
              multiple
              selection
              search
              fluid
              text="Select Reviewers"
              name="reviewers"
              defaultValue={reviewers.map(({ user: { username } }) => username)}
              onChange={this.onChangeReviewers}
              renderLabel={this.renderReviewerLabel}
            />
            <Divider />
          </>
        )}
        {isIssue && (
          <>
            <h5 className={styles.sectionHeader}>Assignees</h5>
            <Dropdown
              options={assigneeOptions}
              selection
              multiple
              search
              fluid
              text="Select Assignees"
              name="assignees"
              defaultValue={currentAssignees ? currentAssignees.map(({ username }) => username) : []}
              onChange={this.onChangeAssignees}
              renderLabel={this.renderLabel}
            />
            <Divider />
          </>
        )}
        <h5 className={styles.sectionHeader}>Labels</h5>
        <Dropdown
          options={labelOptions}
          selection
          multiple
          search
          fluid
          text="Select Labels"
          name="labels"
          defaultValue={defaultLabelValues || null}
          onChange={this.onChangeLabels}
          renderLabel={this.renderLabel}
        />
      </>
    );
  }
}

IssuePrSidebar.propTypes = {
  isIssue: PropTypes.bool.isRequired,
  reviewers: PropTypes.array,
  collaborators: PropTypes.array,
  labels: PropTypes.array.isRequired,
  setLabelsOnCreateItem: PropTypes.func,
  currentLabels: PropTypes.array,
  setLabels: PropTypes.func,
  assignees: PropTypes.array,
  currentAssignees: PropTypes.array,
  setAssignees: PropTypes.func,
  setAssigneesOnCreateItem: PropTypes.func,
  setReviewersOnCreateItem: PropTypes.func,
  setReviewerToPull: PropTypes.func,
  removeReviewerFromPull: PropTypes.func
};

IssuePrSidebar.defaultProps = {
  reviewers: []
};

export default IssuePrSidebar;
