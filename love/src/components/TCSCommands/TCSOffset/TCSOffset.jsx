import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';
import Input from 'components/GeneralPurpose/Input/Input';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import ScriptQueue from 'components/ScriptQueue/ScriptQueue';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText.jsx';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';
import { ATCSCommands, MTCSCommands } from 'Config.js';
import ManagerInterface from 'Utils';
import styles from './TCSOffset.module.css';

var md = new Remarkable();

export default class CommandPanel extends Component {
    static propTypes = {
        title: PropTypes.string,
        nameTCS: PropTypes.string,
        hasRawMode: PropTypes.bool,
        scriptQueueIndex: PropTypes.number,
        subscribeToStreams: PropTypes.func,
        unsubscribeToStreams: PropTypes.func,
        state: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            offset: 0.0,
            horizontalOffsetLabel: "x",
            verticalOffsetLabel: "y",
        };
        this.TCSCommands = {};
        if (props.nameTCS === "aux") this.TCSCommands = ATCSCommands;
        if (props.nameTCS === "main") this.TCSCommands = MTCSCommands;
    }

    isAuxTCS = () => {
        if (this.props.nameTCS === "aux") {
            return true;
        }
        return false;
    };

    isMainTCS = () => {
        if (this.props.nameTCS === "main") {
            return true;
        }
        return false;
    };

    componentDidMount = () => {
        this.props.subscribeToStreams();
        // if (this.isAuxTCS()) {
        //     ManagerInterface.getATCSDocstrings().then((data) => {
        //         this.setState({
        //             docstrings: data,
        //         });
        //     });
        // }
        // if (this.isMainTCS()) {
        //     ManagerInterface.getMTCSDocstrings().then((data) => {
        //         this.setState({
        //             docstrings: data,
        //         });
        //     });
        // }
    };

    componentWillUnmount = () => {
        this.props.unsubscribeToStreams();
    };

    updateOffsetValue = (value) => {
        this.setState({
            offset: Math.abs(Number(value)),
            horizontalOffsetLabel: this.state.horizontalOffsetLabel,
            verticalOffsetLabel: this.state.verticalOffsetLabel,
        });
    };

    checkInvalidAngle = (name, value) => {
        const testValue = value ?? '';
        this.setState({
            paramWarnings: {
                ...this.state.paramWarnings,
                [name]: Number.isNaN(parseFloat(testValue.match(floatRegExp))) && !angleRegExp.test(testValue),
            },
        });
    };

    checkInvalidTime = (name, value) => {
        const testValue = value ?? '';
        this.setState({
            paramWarnings: {
                ...this.state.paramWarnings,
                [name]: !timeRegExp.test(testValue),
            },
        });
    };

    selectOffset = (offsetType) => {
        const labels = offsetType.split("/");

        this.setState({
            offset: this.state.offset,
            horizontalOffsetLabel: labels[0],
            verticalOffsetLabel: labels[1],
        });
    };

    offset = (horizontal, vertical) => {
        if (this.state.horizontalOffsetLabel === 'x') {
            ManagerInterface.runATCSCommand('offset_xy', { x: horizontal, y: vertical });
        }
        else if (this.state.horizontalOffsetLabel === 'az') {
            ManagerInterface.runATCSCommand('offset_azel', { az: horizontal, el: vertical });
        }
        else {
            ManagerInterface.runATCSCommand('offset_radec', { ra: horizontal, dec: vertical });
        }
    };

    offsetUp = () => {
        this.offset(0, this.state.offset);
    };

    offsetDown = () => {
        this.offset(0, -this.state.offset);
    };

    offsetRight = () => {
        this.offset(this.state.offset, 0);
    };

    offsetLeft = () => {
        this.offset(-this.state.offset, 0);
    };

    selectCommand = (commandName) => {
        const paramsDict = this.TCSCommands[commandName] ?? {};
        const paramNames = Object.keys(paramsDict);
        const paramValues = {};
        paramNames.forEach((paramName) => (paramValues[paramName] = paramsDict[paramName][1]));
        this.setState({ selectedCommand: commandName, paramValues });
    };

    render() {
        const paramsDict = this.TCSCommands[this.state.selectedCommand] ?? {};
        const queueState = {
            statusText: ScriptQueue.stateStyleDict[this.props.state],
            name: this.props.state,
        };
        // const isAvailable = queueState.name !== 'Running';
        return (
            <div className={[styles.container, styles.containerExtraRow].join(' ')}>
                <div className={styles.queueStateContainer}>
                    <span className={styles.queueStateLabel}>
                        {this.props.nameTCS && this.props.nameTCS.toUpperCase()} TEL QUEUE STATE
                    </span>
                    <StatusText status={queueState.statusText}>{queueState.name}</StatusText>
                    <span className={styles.warningText}>
                        <span className={styles.warningIcon}>
                            <WarningIcon></WarningIcon>
                        </span>
                        <span>
                            Make sure there are no scripts running or that they are paused.
                        </span>
                    </span>
                </div>

                <div className={styles.offsetAppContainer}>

                    <div className={styles.paramContainer}>
                        <div className={styles.paramLabel}>{'Offset type:'}
                        </div>
                        <div className={styles.offsetContainer}>
                            <Select
                                options={["x/y", "az/el", "ra/dec"]}
                                onChange={(option) => this.selectOffset(option.value)}
                                value="x/y"
                                placeholder="Select offset type."
                            />
                        </div>
                    </div>

                    <div className={styles.paramContainer}>
                        <div className={styles.paramLabel}>{'Offset (in arcsec):'}
                        </div>
                        <div className={styles.offsetContainer}>
                            <Input onChange={(e) => this.updateOffsetValue(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.sendButtonContainer}>

                        <div className={styles.buttonContainer}>
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                status="info"
                                onClick={() => this.offsetUp()}
                            >
                                <div className={styles.arrowContainer}>
                                    +{this.state.verticalOffsetLabel} <ArrowIcon
                                        active={true}
                                        up={true}
                                        style={styles.arrowIcon}
                                    />
                                </div>
                            </Button>
                        </div>

                        <div className={styles.buttonContainer}>
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                status="info"
                                onClick={() => this.offsetLeft()}
                            >
                                <div className={styles.arrowContainer}>
                                    -{this.state.horizontalOffsetLabel} <ArrowIcon
                                        active={true}
                                        up={false}
                                        horizontal={true}
                                        style={styles.arrowIcon}
                                    />
                                </div>
                            </Button>
                        </div>

                        <div className={styles.buttonContainer}>
                            offset: {this.state.offset}
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                status="info"
                                onClick={() => this.offsetRight()}
                            >
                                <div className={styles.arrowContainer}>
                                    +{this.state.horizontalOffsetLabel} <ArrowIcon
                                        active={true}
                                        up={true}
                                        horizontal={true}
                                        style={styles.arrowIcon}
                                    />
                                </div>
                            </Button>
                        </div>

                        <div className={styles.buttonContainer}>
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                status="info"
                                onClick={() => this.offsetDown()}
                            >
                                <div className={styles.arrowContainer}>
                                    -{this.state.verticalOffsetLabel} <ArrowIcon
                                        active={true}
                                        up={false}
                                        style={styles.arrowIcon}
                                    />
                                </div>
                            </Button>
                        </div>

                        <div className={styles.buttonContainer}>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}