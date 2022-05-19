import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ManagerInterface, { parseCommanderData } from 'Utils';
import MTDomeShutter from './MTDomeShutter';
import MTDomeLouvers from './MTDomeLouvers';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import WindRose from '../../icons/WindRose/WindRose';
import DomeSummaryTable from './MTDomeSummaryTable/MTDomeSummaryTable';
import styles from './MTDome.module.css';

import { MTDomeLouversMapAF, MTDomeLouversMapGN } from 'Config';

const defaultValuesAF = {
  A1: '0',
  A2: '0',
  B1: '0',
  B2: '0',
  B3: '0',
  C1: '0',
  C2: '0',
  C3: '0',
  D1: '0',
  D2: '0',
  D3: '0',
  E1: '0',
  E2: '0',
  E3: '0',
  F1: '0',
  F2: '0',
  F3: '0',
};

const defaultValuesGN = {
  G1: '0',
  G2: '0',
  G3: '0',
  H1: '0',
  H2: '0',
  H3: '0',
  I1: '0',
  I2: '0',
  I3: '0',
  L1: '0',
  L2: '0',
  L3: '0',
  M1: '0',
  M2: '0',
  M3: '0',
  N1: '0',
  N2: '0',
};

export default class Dome extends Component {
  static propTypes = {
    // raftsDetailedState: PropTypes.string,
    // imageReadinessDetailedState: PropTypes.string,
    // calibrationDetailedState: PropTypes.string,
    // shutterDetailedState: PropTypes.string,
    // imageSequence: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataLouversAF: [
        {
          Louvers: 'Open [%]',
          ...defaultValuesAF,
        },
        {
          Louvers: 'Cmd. [%]',
          ...defaultValuesAF,
        },
      ],
      dataLouversGN: [
        {
          Louvers: 'Open [%]',
          ...defaultValuesGN,
        },
        {
          Louvers: 'Cmd. [%]',
          ...defaultValuesGN,
        },
      ],
    };
  }

  componentDidMount = () => {
    this.props.subscribeToStream();
  };

  componentWillUnmount = () => {
    this.props.unsubscribeToStream();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.actualPositionLouvers !== this.props.actualPositionLouvers) {
      const dataLouversAFActual = {};
      MTDomeLouversMapAF.forEach((l, i) => {
        dataLouversAFActual[l] = `${this.props.actualPositionLouvers[i].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversAF: [{ ...state.dataLouversAF[0], ...dataLouversAFActual }, { ...state.dataLouversAF[1] }],
      }));

      const dataLouversGNActual = {};
      MTDomeLouversMapGN.forEach((l, i) => {
        dataLouversGNActual[l] = `${this.props.actualPositionLouvers[i + 17].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversGN: [{ ...state.dataLouversGN[0], ...dataLouversGNActual }, { ...state.dataLouversGN[1] }],
      }));
    }

    if (prevProps.commandedPositionLouvers !== this.props.commandedPositionLouvers) {
      const dataLouversAFCommanded = {};
      MTDomeLouversMapAF.forEach((l, i) => {
        dataLouversAFCommanded[l] = `${this.props.commandedPositionLouvers[i].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversAF: [{ ...state.dataLouversAF[0] }, { ...state.dataLouversAF[1], ...dataLouversAFCommanded }],
      }));

      const dataLouversGNCommanded = {};
      MTDomeLouversMapGN.forEach((l, i) => {
        dataLouversGNCommanded[l] = `${this.props.commandedPositionLouvers[i + 17].toFixed(3)}`;
      });
      this.setState((state) => ({
        dataLouversGN: [{ ...state.dataLouversGN[0] }, { ...state.dataLouversGN[1], ...dataLouversGNCommanded }],
      }));
    }
  };

  LOUVERS_AF = [
    {
      field: 'Louvers',
      title: 'Louvers',
    },
    {
      field: 'A1',
      title: 'A1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'A2',
      title: 'A2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B1',
      title: 'B1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B2',
      title: 'B2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'B3',
      title: 'B3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C1',
      title: 'C1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C2',
      title: 'C2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'C3',
      title: 'C3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'D1',
      title: 'D1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'D2',
      title: 'D2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E1',
      title: 'E1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E2',
      title: 'E2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'E3',
      title: 'E3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F1',
      title: 'F1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F2',
      title: 'F2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'F3',
      title: 'F3',
      className: styles.columns,
      type: 'number',
    },
  ];

  LOUVERS_GN = [
    {
      field: 'Louvers',
      title: 'Louvers',
    },
    {
      field: 'G1',
      title: 'G1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'G2',
      title: 'G2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'G3',
      title: 'G3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H1',
      title: 'H1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H2',
      title: 'H2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'H3',
      title: 'H3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I1',
      title: 'I1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I2',
      title: 'I2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'I3',
      title: 'I3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L1',
      title: 'L1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L2',
      title: 'L2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'L3',
      title: 'L3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M1',
      title: 'M1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M2',
      title: 'M2',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'M3',
      title: 'M3',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'N1',
      title: 'N1',
      className: styles.columns,
      type: 'number',
    },
    {
      field: 'N2',
      title: 'N2',
      className: styles.columns,
      type: 'number',
    },
  ];

  render() {
    // correct topics from SAL
    // SummaryTable

    // pending DOME and Tack ID statuses
    const trackID = this.props.trackId;
    const mtdomeSummaryState = this.props.mtdomeSummaryState;
    const modeDomeStatus = this.props.modeDomeStatus;
    const azimuthDomeState = this.props.azimuthDomeState;
    const azimuthDomeTarget = this.props.azimuthDomeTarget;
    const azimuthDomeMotion = this.props.azimuthDomeMotion;
    const elevationDomeState = this.props.elevationDomeState;
    const elevationDomeTarget = this.props.elevationDomeTarget;
    const elevationDomeMotion = this.props.elevationDomeMotion;

    //domeAzimuth
    const positionActualDomeAz = this.props.positionActualDomeAz;
    const positionCommandedDomeAz = this.props.positionCommandedDomeAz;

    //lightWindScreen
    const positionActualLightWindScreen = this.props.positionActualLightWindScreen;
    const positionCommandedLightWindScreen = this.props.positionCommandedLightWindScreen;

    //apertureShutters
    const positionActualShutter = this.props.positionActualShutter;
    const positionCommandedShutter = this.props.positionCommandedShutter;

    // Louvers
    const actualPositionLouvers = this.props?.actualPositionLouvers;
    const commandedPositionLouvers = this.props?.commandedPositionLouvers;

    return (
      <div className={styles.domeContainer}>
        <div className={styles.topRow}>
          <div className={styles.windRoseContainer}>
            <WindRose />
          </div>

          <div className={styles.divDome}>
            <div className={styles.divDomeLouvers}>
              <MTDomeShutter
                positionActualShutter={positionActualShutter}
                positionCommandedShutter={positionCommandedShutter}
                positionActualDomeAz={positionActualDomeAz}
                positionCommandedDomeAz={positionCommandedDomeAz}
              />

              <MTDomeLouvers
                actualPositionLouvers={actualPositionLouvers}
                commandedPositionLouvers={commandedPositionLouvers}
              />
            </div>
            <div className={styles.divSummaryTable}>
              <DomeSummaryTable
                trackID={trackID}
                mtdomeSummaryState={mtdomeSummaryState}
                modeDomeStatus={modeDomeStatus}
                azimuthDomeState={azimuthDomeState}
                azimuthDomeTarget={azimuthDomeTarget}
                azimuthDomeMotion={azimuthDomeMotion}
                elevationDomeState={elevationDomeState}
                elevationDomeTarget={elevationDomeTarget}
                elevationDomeMotion={elevationDomeMotion}
                positionActualDomeAz={positionActualDomeAz}
                positionCommandedDomeAz={positionCommandedDomeAz}
                positionActualLightWindScreen={positionActualLightWindScreen}
                positionCommandedLightWindScreen={positionCommandedLightWindScreen}
                positionActualShutter={positionActualShutter}
                positionCommandedShutter={positionCommandedShutter}
              />
            </div>
          </div>
        </div>

        <SimpleTable headers={this.LOUVERS_AF} data={this.state.dataLouversAF} />
        <SimpleTable headers={this.LOUVERS_GN} data={this.state.dataLouversGN} />
      </div>
    );
  }
}
