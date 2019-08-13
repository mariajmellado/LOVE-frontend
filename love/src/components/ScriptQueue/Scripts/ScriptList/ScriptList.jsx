import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ScriptList.module.css';

export default class ScriptList extends Component {
  static propTypes = {
    children: PropTypes.array,
    onDragExit: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragEnter: PropTypes.func,
  };

  static defaultProps = {
    onDragEnter: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      dragCounter: 0,
    };
    this.dragCounter = 0;
  }

  onDragEnter = (e) => {
    this.props.onDragEnter(e);
  };

  onDragLeave = () => {
    this.dragCounter -= 1;
    this.setState({
      dragCounter: this.state.dragCounter - 1,
    });
  };

  render() {
    return (
      <div
        className={styles.scriptListWrapper}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragExit={this.props.onDragExit}
        onDragEnd={this.props.onDragEnd}
      >
        <div className={styles.scriptListContainer}>{this.props.children}</div>
      </div>
    );
  }
}
