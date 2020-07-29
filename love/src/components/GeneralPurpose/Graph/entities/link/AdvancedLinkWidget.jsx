import * as React from 'react';
import { DiagramEngine, LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';
import createEngine, {
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  DefaultLinkFactory,
  DefaultLinkPointWidget,
} from '@projectstorm/react-diagrams';

import { AdvancedLinkSegmentWidget } from './AdvancedLinkSegmentWidget';
import { LinkPointWidget } from './LinkPointWidget';
import { MouseEvent } from 'react';

export class AdvancedLinkWidget extends React.Component {
  constructor(props) {
    super(props);
    this.refPaths = {
      0: React.createRef(),
    };
    this.state = {
      selected: false,
      hovered: false,
    };
  }

  componentDidUpdate() {
    this.props.link.setRenderedPaths(
      Object.values(this.refPaths).map((ref) => {
        return ref.current;
      }),
    );
  }

  componentDidMount() {
    this.props.link.setRenderedPaths(
      Object.values(this.refPaths).map((ref) => {
        return ref.current;
      }),
    );
  }

  componentWillUnmount() {
    this.props.link.setRenderedPaths([]);
  }

  addPointToLink(event, index) {
    if (
      !event.shiftKey &&
      !this.props.link.isLocked() &&
      this.props.link.getPoints().length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
    ) {
      const newRefKey = Math.max(...Object.keys(this.refPaths)) + 1;
      this.refPaths[newRefKey] = React.createRef();

      const point = new PointModel({
        link: this.props.link,
        position: this.props.diagramEngine.getRelativeMousePoint(event),
      });
      this.props.link.addPoint(point, index);
      event.persist();
      event.stopPropagation();

      this.setState({
        hovered: false,
      });
      this.forceUpdate(() => {
        this.props.diagramEngine.getActionEventBus().fireAction({
          event,
          model: point,
        });
      });
    }
  }

  render() {
    //ensure id is present for all points on the path
    var points = this.props.link.getPoints();
    var paths = [];

    const commonSegmentProps = {
      link: this.props.link,
      onSelection: (selected) => {
        this.setState({ selected: selected });
      },
      hovered: this.state.hovered,
      extras: {
        onMouseDown: (event) => {
          this.addPointToLink(event, 1);
        },
        onMouseEnter: () => {
          console.log('enter');
          this.setState({ hovered: true });
        },
        onMouseLeave: () => {
          console.log('leave');
          this.setState({ hovered: false });
        },
      },
    };
    return (
      <g data-default-link-test={this.props.link.getOptions().testName}>
        {/* line paths without middle points  */}
        {points.length === 2 && (
          // draw the link as dangeling
          // if (this.props.link.getTargetPort() == null) {
          // 	paths.push(this.generatePoint(points[1]));
          // }

          <AdvancedLinkSegmentWidget
            key={`link-${0}`}
            path={this.props.link.getSVGPath()}
            selected={this.state.selected}
            diagramEngine={this.props.diagramEngine}
            factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
            buttonLocation={0.5}
            forwardRef={this.refPaths[0]}
            {...commonSegmentProps}
          />
        )}

        {/* line paths with middle points */}
        {points.length > 2 &&
          points.slice(0, -1).map((point, index) => {
            // if (this.props.link.getTargetPort() == null) {
            // 	paths.push(this.generatePoint(points[points.length - 1]));
            // }

            return (
              <AdvancedLinkSegmentWidget
                key={`link-${index}`}
                path={LinkWidget.generateLinePath(point, points[index + 1])}
                forwardRef={this.refPaths[index]}
                selected={this.state.selected}
                diagramEngine={this.props.diagramEngine}
                buttonLocation={0.5}
                {...commonSegmentProps}
                extras={{
                  ...commonSegmentProps.extras,
                  'data-linkid': this.props.link.getID(),
                  'data-point': index,
                  onMouseDown: (event) => {
                    this.addPointToLink(event, index + 1);
                  },
                }}
              />
            );
          })}

        {/* middle points */}
        {points.length > 2 &&
          points.slice(0, -1).map((point, index) => {
            return (
              <LinkPointWidget
                key={point.getID()}
                point={point}
                colorSelected={this.props.link.getOptions().selectedColor}
                color={this.props.link.getOptions().color}
              />
            );
          })}
      </g>
    );
  }
}
