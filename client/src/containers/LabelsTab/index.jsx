import React from 'react';
import { Loader, Input, Dropdown, Button, List } from 'semantic-ui-react';
import { getLabels, updateLabel, createLabel, deleteLabel } from '../../services/labelsService';
import { getRepositoryByOwnerAndName } from '../../services/repositoryService';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LabelItem from '../../components/LabelItem';
import styles from './styles.module.scss';

class LabelsTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      labels: [],
      searchText: '',
      isCreatingNewLabel: false,
      repositoryId: ''
    };
    this.onCreateLabel = this.onCreateLabel.bind(this);
    this.onDeleteLabel = this.onDeleteLabel.bind(this);
    this.onEditLabel = this.onEditLabel.bind(this);
    this.sortLabels = this.sortLabels.bind(this);
    this.startCreateLabel = this.startCreateLabel.bind(this);
    this.cancelCreateLabel = this.cancelCreateLabel.bind(this);
  }

  async componentDidMount() {
    await this.setState({
      ...this.state,
      loading: true
    });
    let { repositoryId } = this.props;
    if (!repositoryId) {
      const { username, reponame } = this.props.match.params;
      const repository = await getRepositoryByOwnerAndName({ username, reponame });
      repositoryId = repository.id;
    }
    const labels = await getLabels(repositoryId);
    await this.setState({
      ...this.state,
      labels,
      loading: false,
      repositoryId
    });
  }

  getDisplayedLabels = () => {
    const { labels, searchText } = this.state;
    if (!searchText) return labels;
    return labels.filter(label => label.name.includes(searchText) || label.description.includes(searchText));
  };

  setSearchText = e => {
    this.setState({
      ...this.state,
      searchText: e.target.value.toLowerCase()
    });
  };

  renderLabelsList = displayedLabels => {
    const newLabel = { id: '', name: '', description: '', color: '' };
    const { isCreatingNewLabel } = this.state;

    return (
      <List divided verticalAlign="middle">
        {isCreatingNewLabel ? (
          <LabelItem
            key={0}
            labelObject={newLabel}
            onEdit={this.onCreateLabel}
            cancelCreateLabel={this.cancelCreateLabel}
          />
        ) : null}
        {displayedLabels.map((label, idx) => (
          <LabelItem key={idx + 1} labelObject={label} onDelete={this.onDeleteLabel} onEdit={this.onEditLabel} />
        ))}
      </List>
    );
  };

  startCreateLabel = () => {
    this.setState({
      ...this.state,
      isCreatingNewLabel: true
    });
  };

  cancelCreateLabel = () => {
    this.setState({ isCreatingNewLabel: false });
  };

  async onCreateLabel(labelObject) {
    try {
      const { labels, repositoryId } = this.state;
      const addedLabel = await createLabel({ repositoryId, ...labelObject });
      await this.setState({
        ...this.state,
        labels: [addedLabel, ...labels],
        isCreatingNewLabel: false
      });
    } catch (e) {
      return;
    }
  }

  async onDeleteLabel(labelId) {
    try {
      await deleteLabel(labelId);
      const { labels } = this.state;
      await this.setState({
        ...this.state,
        labels: labels.filter(label => label.id !== labelId)
      });
    } catch (e) {
      return;
    }
  }

  async onEditLabel(editedLabel) {
    try {
      await updateLabel(editedLabel);
      const { labels } = this.state;
      const updatedLabels = labels.map(label => (label.id === editedLabel.id ? editedLabel : label));
      await this.setState({
        ...this.state,
        labels: updatedLabels
      });
    } catch (e) {
      return;
    }
  }

  sortLabels = (e, { value }) => {
    const { labels } = this.state;
    const sortedLabels = labels.sort((label, prevLabel) => {
      if (value === 'name_ASC') return label.name > prevLabel.name ? 1 : -1;
      if (value === 'name_DESC') return label.name > prevLabel.name ? -1 : 1;
      return null;
    });
    this.setState({
      ...this.state,
      labels: sortedLabels
    });
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loader active />;
    }
    const displayedLabels = this.getDisplayedLabels();
    const labelsCount = displayedLabels.length;

    const sortOptions = [
      {
        key: 'name_ASC',
        text: 'Alphabetically',
        value: 'name_ASC'
      },
      {
        key: 'name_DESC',
        text: 'Reverse Alphabetically',
        value: 'name_DESC'
      },
      {
        key: 'issues_DESC',
        text: 'Most Issues',
        value: 'issues_DESC',
        disabled: true
      },
      {
        key: 'issues_ASC',
        text: 'Fewest Issues',
        value: 'issues_ASC',
        disabled: true
      }
    ];

    return (
      <>
        <div className={styles.filterRow}>
          <div className={styles.leftGroup}>
            <Input
              icon="search"
              iconPosition="left"
              className={styles.search}
              placeholder="Search all labels"
              onChange={this.setSearchText}
            />
          </div>
          <Button content="New Label" positive onClick={this.startCreateLabel} />
        </div>

        <div className={styles.labelsContainer}>
          <div className={styles.labelsHeader}>
            <div className={styles.labelsCount}>
              <span className={styles.labelsCount}>
                {labelsCount} label{labelsCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={styles.labelsSort}>
              <Dropdown text="Sort">
                <Dropdown.Menu>
                  <Dropdown.Header content="Sort" />
                  {sortOptions.map(({ key, text, value, disabled }) => (
                    <Dropdown.Item key={key} text={text} value={value} disabled={disabled} onClick={this.sortLabels} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className={styles.labelsList}>{this.renderLabelsList(displayedLabels)}</div>
      </>
    );
  }
}

LabelsTab.propTypes = {
  repositoryId: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string,
      reponame: PropTypes.string
    })
  })
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: { id }
    }
  }
}) => ({
  repositoryId: id
});

export default connect(mapStateToProps)(LabelsTab);
