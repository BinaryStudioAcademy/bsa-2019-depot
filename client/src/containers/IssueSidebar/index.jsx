import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import styles from './styles.module.scss';

class IssueSidebar extends React.Component {
  constructor(props) {
    super(props);
    const { issueLabels } = this.props;

    this.state = {
      issueLabels
    };
    this.onPropChange = this.onPropChange.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  onPropChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  onChangeLabels = async (event, { value }) => {
    const { setLabels } = this.props;
    setLabels(value);
  };

  renderLabel(label) {
    return {
      content: label.text,
      className: 'optionLabel'
    };
  }

  render() {
    const { labels } = this.props;
    const { issueLabels } = this.state;
    let defaultLabelValues = null;
    if (issueLabels) {
      defaultLabelValues = issueLabels.map(({ issueLabel }) => issueLabel.label.id);
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

IssueSidebar.propTypes = {
  labels: PropTypes.array.isRequired,
  issueLabels: PropTypes.array,
  setLabels: PropTypes.func
};

export default IssueSidebar;
