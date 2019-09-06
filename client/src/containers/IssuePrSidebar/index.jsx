import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Dropdown, Loader } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';

import styles from './styles.module.scss';

class IssuePrSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialReviewers: [],
      initialAssignees: [],
      initialLabels: [],
      reviewers: [],
      assignees: [],
      labels: [],
      loading: true
    };

    this.onPropChange = this.onPropChange.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  async componentDidMount() {
    // Fetch data
    const { currentLabels } = this.props;
    this.setState({ currentLabels, loading: false });
  }

  onPropChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  onChangeLables = async (event, { value }) => {
    const { setLabelsOnCreateItem, isIssue, setLabelToPull, labels, removeLabelFromPull } = this.props;
    const { currentLabels } = this.state;
    if (setLabelsOnCreateItem) {
      setLabelsOnCreateItem(value.join(' '));
    } else {
      const selectedLabels = value.length;
      if (currentLabels.length < selectedLabels) {
        const label = labels.find(label => label.name === value[selectedLabels - 1]);
        if (!isIssue) {
          setLabelToPull(label.id).then(({ id }) => {
            currentLabels.push({
              id,
              label
            });
            this.setState({ currentLabels });
          });
        }
      } else {
        const label =
          currentLabels.length !== 1
            ? currentLabels.find(({ label }) => label.name === value[selectedLabels - 1])
            : currentLabels[0];
        if (!isIssue) {
          removeLabelFromPull(label.id).then(data => {
            const newCurrentLabels = currentLabels.filter(({ id }) => id !== data.id);
            this.setState({
              currentLabels: newCurrentLabels
            });
          });
        }
      }
    }
  };

  renderLabel(label) {
    return {
      content: label.text,
      className: 'optionLabel'
    };
  }

  render() {
    const { isIssue, labels } = this.props;
    const { currentLabels, loading } = this.state;
    let defaultLabelValues = null;
    if (currentLabels) {
      defaultLabelValues = currentLabels.map(({ label }) => label.name);
    }
    const reviewers = [
      {
        id: '5d7e8149-c61f-444e-a998-15c3d3d92624',
        username: 'thesubliminalfffffffffffff',
        imgUrl: null
      },
      {
        id: '5d7e8149-c61f-444e-a998-15c3dd3d92624',
        username: 'sublimini',
        imgUrl: 'https://api.adorable.io/avatars/face/eyes4/nose3/mouth7/8e8895'
      }
    ];

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

    const initialReviewers = [
      {
        id: '5d7e8149-c61f-444e-a998-15c3dd3d92624',
        username: 'sublimini',
        imgUrl: 'https://api.adorable.io/avatars/face/eyes4/nose3/mouth7/8e8895'
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

    const reviewerOptions = reviewers.map(({ id, username, imgUrl }) => ({
      key: id,
      text: username,
      value: username,
      image: { avatar: true, src: getUserImgLink(imgUrl) }
    }));

    const assigneeOptions = assignees.map(({ id, username, imgUrl }) => ({
      key: id,
      text: username,
      value: username,
      image: { avatar: true, src: getUserImgLink(imgUrl) }
    }));

    const labelOptions = labels.map(({ id, name, description, color }) => ({
      key: id,
      text: name,
      value: name,
      content: (
        <>
          <div className={styles.labelName}>
            <span className={styles.labelColor} style={{ backgroundColor: color }} /> {name}
          </div>
          <div>{description}</div>
        </>
      )
    }));

    return !loading ? (
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
              defaultValue={initialReviewers.map(({ username }) => username)}
              onChange={this.onPropChange}
              renderLabel={this.renderLabel}
            />
            <Divider />
          </>
        )}
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
          onChange={this.onChangeLables}
          renderLabel={this.renderLabel}
        />
      </>
    ) : (
      <Loader active />
    );
  }
}

IssuePrSidebar.propTypes = {
  isIssue: PropTypes.bool.isRequired,
  labels: PropTypes.array.isRequired,
  setLabelsOnCreateItem: PropTypes.func,
  currentLabels: PropTypes.array,
  setLabelToPull: PropTypes.func,
  removeLabelFromPull: PropTypes.func
};

export default IssuePrSidebar;
