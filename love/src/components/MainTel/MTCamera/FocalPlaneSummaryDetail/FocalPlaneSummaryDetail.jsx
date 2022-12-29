import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SummaryPanel from '../../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Row from '../../../GeneralPurpose/SummaryPanel/Row';
import Label from '../../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../../GeneralPurpose/SummaryPanel/Title';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from '../../../GeneralPurpose/StatusText/StatusText';
import styles from './FocalPlaneSummaryDetail.module.css';
import {
  summaryStateStateMap,
  summaryStateStateToStyle,
  mtcameraRaftTempControlState,
  mtcameraRaftTempControlStateToStyle,
} from 'Config';
import { defaultNumberFormatter } from 'Utils';

class FocalPlaneSummaryDetail extends Component {
  constructor() {
    super();
    this.state = {
      raftSummaryState: 0,
      raftTempControlState: 0,
      ccdsData: [],
      rebsData: [],
    };
  }

  REBs = [
    {
      field: 'identifier',
      title: '',
    },
    {
      field: 'bias',
      title: 'Bias',
      render: (value) => defaultNumberFormatter(value),
    },
    {
      field: 'voltage',
      title: 'Voltage [V]',
      type: 'number',
      className: styles.columns,
      render: (value) => defaultNumberFormatter(value),
    },
    {
      field: 'power',
      title: 'Power [P]',
      type: 'number',
      className: styles.columns,
      render: (value) => defaultNumberFormatter(value),
    },
  ];

  getCCDsHeaders() {
    return [
      {
        field: 'identifier',
        title: '',
      },
      {
        field: 'GD',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'gDV' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('gDV')}
          >
            GD 0 [V]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'ODm',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'oDI' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('oDI')}
          >
            OD 0 [mA]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'ODv',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'oDV' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('oDV')}
          >
            OD 0 [V]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'GV',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'oGV' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('oGV')}
          >
            GV 0 [V]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'RD',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'rDV' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('rDV')}
          >
            RD 0 [V]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
      {
        field: 'SW',
        title: (
          <span
            style={{ color: this.props.selectedCCDVar === 'temp' ? 'red' : 'black' }}
            className={styles.clickableHeader}
            onClick={() => this.changeCCDsPlotsVariable('temp')}
          >
            SW 0 [C°]
          </span>
        ),
        type: 'number',
        className: styles.columns,
        render: (value) => defaultNumberFormatter(value),
      },
    ];
  }

  changeCCDsPlotsVariable(variable) {
    const { setSelectedCCDVar } = this.props;
    setSelectedCCDVar(variable);
  }

  getCCDIndex(id) {
    return parseInt(id) - 1;
  }

  getRebIndex(id) {
    return parseInt(id) - 1;
  }

  getSummaryDetailData() {
    const {
      selectedRaft,
      selectedCCD,
      selectedReb,
      tempControlActive,
      hVBiasSwitch,
      anaV,
      power,
      gDV,
      oDI,
      oDV,
      oGV,
      rDV,
      temp,
    } = this.props;
    const { ccds, rebs } = selectedRaft;

    const raftSummaryState = 2; // TODO: get info src
    const raftTempControlState = tempControlActive[selectedRaft.id - 1] ? 1 : 0;

    const ccdsData = [];
    ccds.forEach((c) => {
      ccdsData.push({
        identifier: `CCD ${c.id}`,
        GD: gDV[this.getCCDIndex(c.id)],
        ODm: oDI[this.getCCDIndex(c.id)],
        ODv: oDV[this.getCCDIndex(c.id)],
        GV: oGV[this.getCCDIndex(c.id)],
        RD: rDV[this.getCCDIndex(c.id)],
        SW: temp[this.getCCDIndex(c.id)],
        rowClass: selectedCCD?.id === c.id ? styles.selectedRow : '',
      });
    });

    const rebsData = [];
    rebs.forEach((r) => {
      rebsData.push({
        identifier: `REB ${r.id}`,
        bias: hVBiasSwitch[this.getRebIndex(r.id)],
        voltage: anaV[this.getRebIndex(r.id)],
        power: power[this.getRebIndex(r.id)],
        rowClass: selectedReb?.id === r.id ? styles.selectedRow : '',
      });
    });

    this.setState({ raftSummaryState, raftTempControlState, ccdsData, rebsData });
  }

  componentDidMount() {
    this.getSummaryDetailData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.selectedRaft && this.props.selectedRaft.id !== prevProps.selectedRaft?.id) ||
      (this.props.selectedReb && this.props.selectedReb.id !== prevProps.selectedReb?.id) ||
      (this.props.selectedCCD && this.props.selectedCCD.id !== prevProps.selectedCCD?.id)
    ) {
      this.getSummaryDetailData();
    }
  }

  render() {
    const { selectedRaft } = this.props;
    const { raftSummaryState, raftTempControlState, ccdsData, rebsData } = this.state;

    return (
      <div>
        <div className={styles.container}>
          <SummaryPanel className={styles.summaryPanel}>
            <Title>Raft {selectedRaft.id}</Title>
            <Value>
              <StatusText status={summaryStateStateToStyle[summaryStateStateMap[raftSummaryState]]}>
                {summaryStateStateMap[raftSummaryState]}
              </StatusText>
            </Value>
            <Label>Temp Control</Label>
            <Value>
              <StatusText
                status={mtcameraRaftTempControlStateToStyle[mtcameraRaftTempControlState[raftTempControlState]]}
              >
                {mtcameraRaftTempControlState[raftTempControlState]}
              </StatusText>
            </Value>
          </SummaryPanel>
        </div>
        {/* REBs table */}
        <div>
          <SimpleTable headers={this.REBs} data={rebsData} />
        </div>
        {/* CCDs table */}
        <div>
          <SimpleTable headers={this.getCCDsHeaders()} data={ccdsData} />
        </div>
      </div>
    );
  }
}

export default FocalPlaneSummaryDetail;
