import React from 'react';
import { Loader, Icon, Input, Dropdown, Button, List } from 'semantic-ui-react';
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
      searchText: ''
    };
    this.onDeleteLabel = this.onDeleteLabel.bind(this);
    this.onEditLabel = this.onEditLabel.bind(this);
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
      loading: false
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
      searchText: e.target.value
    });
  };

  // onCreateLabel = () => {};

  renderLabelsList = displayedLabels => {
    return (
      <List divided verticalAlign="middle">
        {displayedLabels.map((label, idx) => (
          <LabelItem key={idx} labelObject={label} onDelete={this.onDeleteLabel} onEdit={this.onEditLabel} />
        ))}
      </List>
    );
  };

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
        value: 'issues_DESC'
      },
      {
        key: 'issues_ASC',
        text: 'Fewest Issues',
        value: 'issues_ASC'
      }
    ];

    return (
      <>
        <div className={styles.filterRow}>
          <div className={styles.leftGroup}>
            <Button color="blue" className={styles.labelButton}>
              <Button.Content className={styles.labelButtonIcon}>
                <Icon name="tag" />
              </Button.Content>

              <Button.Content className={styles.labelButtonText}>Labels</Button.Content>
            </Button>
            <Input
              icon="search"
              iconPosition="left"
              className={styles.search}
              placeholder="Search all labels"
              onChange={this.setSearchText}
            />
          </div>
          <Button content="New Label" positive onClick={this.onCreateLabel} />
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
                  {sortOptions.map(({ key, text, value }) => (
                    <Dropdown.Item key={key} text={text} value={value} />
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
    currentRepoInfo: { id }
  }
}) => ({
  repositoryId: id
});

export default connect(mapStateToProps)(LabelsTab);
