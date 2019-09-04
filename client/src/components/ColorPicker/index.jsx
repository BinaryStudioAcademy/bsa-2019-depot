import React from 'react';
import PropTypes from 'prop-types';
import reactCSS from 'reactcss';
import { CompactPicker } from 'react-color';

class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = ({ hex }) => {
    const { handleChangeColor, setFieldValue } = this.props;
    setFieldValue('color', hex);
    handleChangeColor(hex);
  };

  render() {
    const { color } = this.props;

    const styles = reactCSS({
      default: {
        wrapper: {
          paddingRight: '.5em',
          width: '90px',
          height: '40px'
        },
        label: {
          fontWeight: 'bold'
        },
        color: {
          height: '100%',
          borderRadius: '2px',
          background: color
        },
        swatch: {
          width: '100%',
          height: '36px',
          marginTop: '0.3em',
          padding: '5px',
          borderRadius: '3px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    });

    return (
      <div style={styles.wrapper}>
        <label style={styles.label}>or choose it</label>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <CompactPicker color={color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  handleChangeColor: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default ColorPicker;
