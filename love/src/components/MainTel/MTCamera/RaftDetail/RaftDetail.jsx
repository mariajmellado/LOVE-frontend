import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import Neighbors from 'components/GeneralPurpose/Neighbors/Neighbors';
import CCDDetail from '../CCDDetail/CCDDetail';
import styles from './RaftDetail.module.css';
import { mtcameraRaftsNeighborsMapping } from 'Config';

const COLOR_MAPPING = {
  1: 'var(--status-ok-dimmed-color-3)',
  2: 'var(--status-warning-dimmed-color-3)',
  3: 'var(--status-alert-dimmed-color-3)',
};

class RaftDetail extends Component {
  constructor(props) {
    super(props);
    this.CCDsrefs = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ];
    this.rebsRefs = [React.createRef(), React.createRef(), React.createRef()];
  }

  renderCCDsPlots() {
    const { raft, selectedCCD, selectedCCDVar, setSelectedCCD } = this.props;
    const plots = [];
    raft.ccds.forEach((c) => {
      plots.push({
        [`CCD${c.id}`]: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
        // [`CCD${c.id}`]: {
        //   category: 'telemetry',
        //   csc: 'MTCamera',
        //   salindex: 0,
        //   topic: 'focal_plane_Ccd',
        //   item: selectedCCDVar,
        //   type: 'line',
        //   accessor: (x) => x[c.id],
        // },
      });
    });

    return (
      <div className={styles.ccdsContainer}>
        {plots.map((p, i) => (
          <div
            key={`c${i}`}
            ref={this.CCDsrefs[i]}
            style={{ border: `2px solid ${COLOR_MAPPING[raft.ccds[i].status]}` }}
            className={styles.plot}
            onClick={() => {
              setSelectedCCD(raft.ccds[i]);
            }}
          >
            <PlotContainer
              memorySize={50}
              inputs={p}
              containerNode={this.CCDsrefs[i]?.current}
              xAxisTitle="Time"
              yAxisTitle={`${selectedCCDVar} - ${raft.ccds[i].id}`}
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  renderRebsPlots() {
    const { raft, selectedReb, selectedRebVar, setSelectedReb } = this.props;
    const plots = [];
    raft.rebs.forEach((r) => {
      plots.push({
        [`REB${r.id}`]: {
          category: 'telemetry',
          csc: 'ATDome',
          salindex: 0,
          topic: 'position',
          item: 'azimuthPosition',
          type: 'line',
          accessor: (x) => x,
        },
        // [`REB${r.id}`]: {
        //   category: 'telemetry',
        //   csc: 'MTCamera',
        //   salindex: 0,
        //   topic: 'focal_plane_Reb',
        //   item: selectedRebVar,
        //   type: 'line',
        //   accessor: (x) => x[r.id],
        // },
      });
    });

    return (
      <div className={styles.rebsContainer}>
        {plots.map((p, i) => (
          <div
            key={`r${i}`}
            ref={this.rebsRefs[i]}
            style={{ border: selectedReb?.id === raft.rebs[i].id ? '2px solid white' : `` }}
            className={styles.plot}
            onClick={() => {
              setSelectedReb(raft.rebs[i]);
            }}
          >
            <PlotContainer
              memorySize={50}
              inputs={p}
              containerNode={this.rebsRefs[i]?.current}
              xAxisTitle="Time"
              yAxisTitle={`Value-${i}`}
              legendPosition="bottom"
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { raft, showNeighbors, selectedReb, selectNeighborRaft } = this.props;

    const edgesColors = {
      top: raft.neighbors.top ? COLOR_MAPPING[raft.neighbors.top.status] : 'transparent',
      right: raft.neighbors.right ? COLOR_MAPPING[raft.neighbors.right.status] : 'transparent',
      bottom: raft.neighbors.bottom ? COLOR_MAPPING[raft.neighbors.bottom.status] : 'transparent',
      left: raft.neighbors.left ? COLOR_MAPPING[raft.neighbors.left.status] : 'transparent',
    };
    return showNeighbors ? (
      <div style={{ height: '100%' }}>
        <Neighbors edgesColors={edgesColors} selectNeighbor={selectNeighborRaft}>
          {this.renderCCDsPlots()}
          {this.renderRebsPlots()}
        </Neighbors>
      </div>
    ) : (
      <div style={{ height: '100%' }}>
        {this.renderCCDsPlots()}
        {this.renderRebsPlots()}
      </div>
    );
  }
}

export default RaftDetail;
