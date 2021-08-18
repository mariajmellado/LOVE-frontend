import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import styles from './CableWraps.module.css';
import CameraCableWrap from './CameraCableWrap/CameraCableWrap';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import Title from '../../GeneralPurpose/SummaryPanel/Title';

const MAX_CCW_FOLLOWING_ERROR = 4.0;

class CableWraps extends Component {
  static propTypes = {
    ccwPosition: PropTypes.number,
    rotatorPosition: PropTypes.number,
    cameraCableWrapState: PropTypes.number,
    ccwFollowingError: PropTypes.number,
    subscribeToStreams: PropTypes.func,
    unsubscribeToStreams: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ccwFollowingErrorState: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ccwFollowingError !== this.props.ccwFollowingError) {
      if (this.props.ccwFollowingError > MAX_CCW_FOLLOWING_ERROR) {
        this.setState({ ccwFollowingErrorState: true });
      } else {
        this.setState({ ccwFollowingErrorState: false });
      }
    }
    // For development purposes: simulators doesn't have ccwFollowingError
    // if (prevProps.ccwPosition !== this.props.ccwPosition || prevProps.rotatorPosition !== this.props.rotatorPosition) {
    //   console.log(Math.abs(this.props.ccwPosition - this.props.rotatorPosition));
    //   console.log(Math.abs(this.props.ccwPosition - this.props.rotatorPosition) > MAX_CCW_FOLLOWING_ERROR);
    //   if (Math.abs(this.props.ccwPosition - this.props.rotatorPosition) > MAX_CCW_FOLLOWING_ERROR) {
    //     this.setState({ ccwFollowingErrorState: true });
    //   } else {
    //     this.setState({ ccwFollowingErrorState: false });
    //   }
    // }
  }

  static drawLimits(g, radio, start, end) {
    g.append('rect')
      .attr('x', -1)
      .attr('y', -radio - 10)
      .attr('width', 2)
      .attr('height', 30)
      .style('fill', '#fff');

    g.append('text').attr('x', 2).attr('y', -145).text('0°').style('fill', '#fff');

    g.append('rect')
      .attr('x', -radio - 10)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 2)
      .style('fill', '#fff');

    g.append('text')
      .attr('x', -radio - 50)
      .attr('y', 5)
      .text(`${start}°`)
      .style('fill', '#fff');

    g.append('rect')
      .attr('x', radio - 20)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 2)
      .style('fill', '#fff');

    g.append('text')
      .attr('x', radio + 15)
      .attr('y', 5)
      .text(`${end}°`)
      .style('fill', '#fff');
  }

  static arcTween(newAngle, arc) {
    return function (d) {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      return function (t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    };
  }

  render() {
    const { ccwFollowingErrorState } = this.state;
    const cameraCableWrapState = CSCDetail.states[this.props.cameraCableWrapState];
    const ccwPosition = this.props.ccwPosition ?? 0;
    const rotatorPosition = this.props.rotatorPosition ?? 0;

    return (
      <div className={styles.cableWrapsContainer}>
        <div>
          <SummaryPanel className={styles.summaryPanelStates}>
            <Title>Camera Cable Wrap</Title>
            <Value>
              <span className={[cameraCableWrapState.class, styles.summaryState].join(' ')}>
                {cameraCableWrapState.name}
              </span>
            </Value>

            <Label>Rotator Position</Label>
            <Value>{`${rotatorPosition}°`}</Value>

            <Label>Cable Wrap Position</Label>
            <Value>{`${ccwPosition}°`}</Value>
          </SummaryPanel>
        </div>
        <div className={styles.divCameraWrap}>
          <CameraCableWrap
            height={315}
            width={400}
            drawBackground={(g, t, a) => this.drawBackground(g, t, a)}
            drawLimits={CableWraps.drawLimits}
            arcTween={CableWraps.arcTween}
            cableWrap={ccwPosition}
            rotator={rotatorPosition}
            ccwFollowingErrorState={ccwFollowingErrorState}
          />
        </div>
      </div>
    );
  }
}
export default CableWraps;
