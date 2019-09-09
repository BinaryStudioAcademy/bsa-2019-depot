import React from 'react';
import PropTypes from 'prop-types';
import Octicon, { Comment, RequestChanges, Check, PrimitiveDot } from '@primer/octicons-react';
import { Divider, Dropdown } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

class IssuePrSidebar extends React.Component {
  constructor(props) {
    super(props);

    const { currentLabels, reviewers } = this.props;

    this.state = {
      currentLabels,
      reviewers
    };

    this.onPropChange = this.onPropChange.bind(this);
    this.onChangeReviewers = this.onChangeReviewers.bind(this);
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
    const { isIssue, collaborators, labels } = this.props;
    const { currentLabels, reviewers } = this.state;
    let defaultLabelValues = null;
    if (currentLabels) {
      defaultLabelValues = currentLabels.map(({ label }) => label.id);
    }

    const assignees = [
      {
        id: '5d7e8149-c61e-444e-a998-15c3d3d92624',
        username: 'thesublimidwe',
        imgUrl: 'https://tinyfac.es/data/avatars/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg'
      },
      {
        id: '5d7e8d-c61e-444e-a998-15c3d3d92624',
        username: 'sdfsdf',
        imgUrl: 'https://randomuser.me/api/portraits/women/47.jpg'
      },
      {
        id: '5d7e8d-c61e-444e-a998-15c3wd3d92624',
        username: 'abcdef',
        imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
      }
    ];

    const initialAssignees = [
      {
        id: '5d7e8149-c61e-444e-a998-15c3d3d92624',
        username: 'thesublimidwe',
        imgUrl: 'https://tinyfac.es/data/avatars/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg'
      },
      {
        id: '5d7e8d-c61e-444e-a998-15c3d3d92624',
        username: 'sdfsdf',
        imgUrl: 'https://randomuser.me/api/portraits/women/47.jpg'
      }
    ];

    let reviewerOptions;
    if (!isIssue) {
      reviewerOptions = collaborators.map(({ id, user: { username, imgUrl } }) => ({
        key: id,
        text: username,
        value: username,
        image: { avatar: true, src: getUserImgLink(imgUrl) }
      }));
    }

    const assigneeOptions = assignees.map(({ id, username, imgUrl }) => ({
      key: id,
      text: username,
      value: username,
      image: { avatar: true, src: getUserImgLink(imgUrl) }
    }));
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
        {!isIssue && (
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
              defaultValue={initialAssignees.map(({ username }) => username)}
              onChange={this.onPropChange}
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
  setReviewersOnCreateItem: PropTypes.func,
  setReviewerToPull: PropTypes.func,
  removeReviewerFromPull: PropTypes.func
};

IssuePrSidebar.defaultProps = {
  reviewers: []
};

export default IssuePrSidebar;
