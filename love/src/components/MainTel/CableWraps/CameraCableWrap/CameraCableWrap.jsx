import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { radians, degrees } from 'Utils';

const MAX_CCW_FOLLOWING_ERROR = 2.0;
const ARC_TRANSITION_DURATION = 1000;
const COLOR_CABLE_INITIAL = '#29414B';
const COLOR_CABLE_ERROR = '#DC5707';
const COLOR_ARC_INITIAL = '#35667E';
const COLOR_ARC_ERROR = '#3B2B1F';
const TAU = Math.PI / 2; //to transform angles to radians

const rotArcAngles = {
  start: radians(-MAX_CCW_FOLLOWING_ERROR / 2.0 - 1.6),
  end: radians(-MAX_CCW_FOLLOWING_ERROR / 2.0),
};
const rotArc2Angles = {
  start: radians(MAX_CCW_FOLLOWING_ERROR / 2.0),
  end: radians(MAX_CCW_FOLLOWING_ERROR / 2.0 + 1.6),
};
const ccwArcAngles = {
  start: radians(-1),
  end: radians(1),
};

class CameraCableWrap extends Component {
  constructor(props) {
    super(props);
    this.g = null;
  }

  removeCameraCableWrap() {
    this.g.remove();
  }

  createCameraCableWrap(dom) {
    const radio = 140;
    const { width, height } = this.props;

    const svg = d3.select(dom).append('svg').attr('class', 'd3').attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    this.g = g;

    const background = d3
      .arc()
      .innerRadius(radio - 10)
      .outerRadius(radio)
      .startAngle(-TAU);

    const rotArc = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(rotArcAngles.start)
      .endAngle(rotArcAngles.end);
    this.rotArc = rotArc;

    const rotArc2 = d3
      .arc()
      .innerRadius(radio - 20)
      .outerRadius(radio + 10)
      .startAngle(rotArc2Angles.start)
      .endAngle(rotArc2Angles.end);
    this.rotArc2 = rotArc2;

    const ccwArc = d3
      .arc()
      .innerRadius(radio - 25)
      .outerRadius(radio + 15)
      .startAngle(ccwArcAngles.start)
      .endAngle(ccwArcAngles.end);
    this.ccwArc = ccwArc;

    this.background = this.g
      .append('path')
      .datum({ endAngle: TAU })
      .style('fill', COLOR_ARC_INITIAL)
      .attr('d', background);

    this.rot = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.rotArc)
      .attr('id', 'rotator');

    this.rot2 = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#43e0f9')
      .attr('d', this.rotArc2)
      .attr('id', 'rotator');

    this.ccw = this.g
      .append('path')
      .datum({ endAngle: 0 })
      .style('fill', COLOR_CABLE_INITIAL)
      .attr('d', this.ccwArc)
      .attr('id', 'cable_wrap');

    const theta = degrees(Math.PI / 2);
    this.props.drawLimits(g, radio, theta, -theta);
  }

  updateCameraCableWrap() {
    const { ccwFollowingErrorState } = this.props;

    const newCablePosition = radians(this.props.cableWrap);
    const newRotatorPosition = radians(this.props.rotator);

    this.rot
      .transition()
      .duration(ARC_TRANSITION_DURATION)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, newRotatorPosition)(t);
          this.rotArc.startAngle(rotArcAngles.start + angle);
          this.rotArc.endAngle(rotArcAngles.end + angle);
          return this.rotArc(d);
        };
      })
      .on('end', () => {
        this.rot.datum({ endAngle: newRotatorPosition });
      });

    this.rot2
      .transition()
      .duration(ARC_TRANSITION_DURATION)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, newRotatorPosition)(t);
          this.rotArc2.startAngle(rotArc2Angles.start + angle);
          this.rotArc2.endAngle(rotArc2Angles.end + angle);
          return this.rotArc2(d);
        };
      })
      .on('end', () => {
        this.rot2.datum({ endAngle: newRotatorPosition });
      });

    this.ccw
      .transition()
      .duration(ARC_TRANSITION_DURATION)
      .attrTween('d', (d) => {
        return (t) => {
          const angle = d3.interpolate(d.endAngle, newCablePosition)(t);
          this.ccwArc.startAngle(ccwArcAngles.start + angle);
          this.ccwArc.endAngle(ccwArcAngles.end + angle);
          return this.ccwArc(d);
        };
      })
      .on('end', () => {
        this.ccw
          .style('fill', ccwFollowingErrorState ? COLOR_CABLE_ERROR : COLOR_CABLE_INITIAL)
          .datum({ endAngle: newCablePosition });
      });

    this.background.style('fill', ccwFollowingErrorState ? COLOR_ARC_ERROR : COLOR_ARC_INITIAL);
  }

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    this.createCameraCableWrap(dom);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.cableWrap !== this.props.cableWrap ||
      prevProps.rotator !== this.props.rotator ||
      prevProps.ccwFollowingErrorState !== this.props.ccwFollowingErrorState
    ) {
      this.updateCameraCableWrap();
    }
  }

  render() {
    return <div ref="az-cable-wrap-container"></div>;
  }
}

export default CameraCableWrap;
