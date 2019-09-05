import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Divider, Dropdown, Image } from 'semantic-ui-react';
import Octicon, { Unmute } from '@primer/octicons-react';
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

  componentDidMount() {
    // Fetch data
  }

  onPropChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  renderLabel(label) {
    return {
      content: label.text,
      className: 'optionLabel'
    };
  }

  render() {
    const { isIssue } = this.props;

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

    const labels = [{
      'id': 'f90ff2f6-59e2-455d-85a5-f3a58505606d',
      'name': 'bug',
      'description': 'Something isn`t working',
      'color': '#d73a4a',
      'createdAt': '2019-09-01T09:24:12.566Z',
      'updatedAt': '2019-09-01T09:24:12.566Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '71cc5073-353a-42d7-88f5-0756267aa16d',
      'name': 'documentation',
      'description': 'Improvements or additions to documentation',
      'color': '#0075ca',
      'createdAt': '2019-09-01T09:24:12.566Z',
      'updatedAt': '2019-09-01T09:24:12.566Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '1cdcaf9b-4fcf-42b9-a347-ff1b9ba69c37',
      'name': 'duplicate',
      'description': 'This issue or pull request already exists',
      'color': '#cfd3d7',
      'createdAt': '2019-09-01T09:24:12.571Z',
      'updatedAt': '2019-09-01T09:24:12.571Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '20bb766e-6f86-43a2-8881-03993f64649f',
      'name': 'enhancement',
      'description': 'New feature or request',
      'color': '#a2eeef',
      'createdAt': '2019-09-01T09:24:12.571Z',
      'updatedAt': '2019-09-01T09:24:12.571Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '24fe4535-b6db-4b4e-8071-32a6157be0be',
      'name': 'good first issue',
      'description': 'Good for newcomers',
      'color': '#7057ff',
      'createdAt': '2019-09-01T09:24:12.575Z',
      'updatedAt': '2019-09-01T09:24:12.575Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '7f52c57a-4942-4fd5-afd4-992b6fc99e45',
      'name': 'help wanted',
      'description': 'Extra attention is needed',
      'color': '#008672',
      'createdAt': '2019-09-01T09:24:12.575Z',
      'updatedAt': '2019-09-01T09:24:12.575Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': '9c300c41-34f9-4d7b-bd27-da6c6d3aaa1b',
      'name': 'invalid',
      'description': 'This doesn\'t seem right',
      'color': '#e4e669',
      'createdAt': '2019-09-01T09:24:12.579Z',
      'updatedAt': '2019-09-01T09:24:12.579Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }, {
      'id': 'ab26bae8-3067-4eb0-b240-d4fc2e2bf928',
      'name': 'question',
      'description': 'Further information is requested',
      'color': '#d876e3',
      'createdAt': '2019-09-01T09:24:12.580Z',
      'updatedAt': '2019-09-01T09:24:12.580Z',
      'deletedAt': null,
      'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
    }];

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

    const initialLabels = [
      {
        'id': '1cdcaf9b-4fcf-42b9-a347-ff1b9ba69c37',
        'name': 'duplicate',
        'description': 'This issue or pull request already exists',
        'color': '#cfd3d7',
        'createdAt': '2019-09-01T09:24:12.571Z',
        'updatedAt': '2019-09-01T09:24:12.571Z',
        'deletedAt': null,
        'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
      },
      {
        'id': '20bb766e-6f86-43a2-8881-03993f64649f',
        'name': 'enhancement',
        'description': 'New feature or request',
        'color': '#a2eeef',
        'createdAt': '2019-09-01T09:24:12.571Z',
        'updatedAt': '2019-09-01T09:24:12.571Z',
        'deletedAt': null,
        'repositoryId': '60e9cc5e-e7d5-4199-a787-07c735a861cd'
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
          <div className={styles.labelName}><span className={styles.labelColor} style={{ backgroundColor: color }}/>{ ' ' }{ name }</div>
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
              defaultValue={initialReviewers.map(({ username }) => username)}
              onChange={this.onPropChange}
              renderLabel={this.renderLabel}
            />
            <Divider/>
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
        <Divider/>
        <h5 className={styles.sectionHeader}>Labels</h5>
        <Dropdown
          options={labelOptions}
          selection
          multiple
          search
          fluid
          text="Select Labels"
          name="labels"
          defaultValue={initialLabels.map(({ name }) => name)}
          onChange={this.onPropChange}
          renderLabel={this.renderLabel}
        />
      </>
    );
  }
}

IssuePrSidebar.propTypes = {
  isIssue: PropTypes.bool.isRequired
};

export default IssuePrSidebar;
