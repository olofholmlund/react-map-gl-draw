// @flow

import * as React from 'react';
import { MapContext } from '@urbica/react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import theme from '@mapbox/mapbox-gl-draw/src/lib/theme';
import modes from '@mapbox/mapbox-gl-draw/src/modes';
import type { EventProps } from './eventProps';
import events from './events';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

export type Props = EventProps & {
  /** Draw controls position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',

  /** Whether or not to enable keyboard interactions for drawing. */
  keybindings?: boolean,

  /** Whether or not to enable touch interactions for drawing. */
  touchEnabled?: boolean,

  /**
   * Whether or not to enable box selection of features with shift+click+drag.
   * If false, shift+click+drag zooms into an area.
   */
  boxSelect?: boolean,

  /**
   * Number of pixels around any feature or vertex (in every direction)
   * that will respond to a click.
   */
  clickBuffer?: number,

  /**
   * Number of pixels around any feature of vertex (in every direction)
   * that will respond to a touch.
   */
  touchBuffer?: number,

  /** Hide or show Point Control. */
  pointControl?: boolean,

  /** Hide or show Line String Control. */
  lineStringControl?: boolean,

  /** Hide or show Polygon Control. */
  polygonControl?: boolean,

  /** Hide or show Trash Control. */
  trashControl?: boolean,

  /** Hide or show Combine Features Control. */
  combineFeaturesControl?: boolean,

  /** Hide or show Uncombine Features Control. */
  uncombineFeaturesControl?: boolean,

  /**
   *  The default value for controls. For example, if you would like all
   *  controls to be off by default, and specify a whitelist with controls,
   *  use displayControlsDefault: false.
   */
  displayControlsDefault?: boolean,

  /** An array of map style objects. */
  styles?: Array<Object>,

  /** Over ride the default modes with your own. */
  modes?: Object,

  /** The mode that user will first land in. */
  defaultMode?:
    'simple_select'
    | 'direct_select'
    | 'draw_line_string'
    | 'draw_polygon'
    | 'draw_point',

  /**
   * Properties of a feature will also be available for styling
   * and prefixed with user_, e.g., ['==', 'user_custom_label', 'Example']
   */
  userProperties?: boolean,

  /** Valid geoJSON to edit with Draw. */
  data: Object
};

class Draw extends React.PureComponent<Props> {
  static defaultProps = {
    position: 'top-right',
    keybindings: true,
    touchEnabled: true,
    boxSelect: true,
    clickBuffer: 2,
    touchBuffer: 25,
    pointControl: true,
    lineStringControl: true,
    polygonControl: true,
    trashControl: true,
    combineFeaturesControl: true,
    uncombineFeaturesControl: true,
    displayControlsDefault: true,
    styles: theme,
    modes,
    defaultMode: 'simple_select',
    userProperties: false,
    onDrawCreate: null,
    onDrawDelete: null,
    onDrawCombine: null,
    onDrawUncombine: null,
    onDrawUpdate: null,
    onDrawSelectionChange: null,
    onDrawModeChange: null,
    onDrawRender: null,
    onDrawActionable: null
  };

  componentDidMount() {
    // $FlowFixMe
    const map = this._map;
    const draw = new MapboxDraw({
      keybindings: this.props.keybindings,
      touchEnabled: this.props.touchEnabled,
      boxSelect: this.props.boxSelect,
      clickBuffer: this.props.clickBuffer,
      touchBuffer: this.props.touchBuffer,
      controls: {
        point: this.props.pointControl,
        line_string: this.props.lineStringControl,
        polygon: this.props.polygonControl,
        trash: this.props.trashControl,
        combine_features: this.props.combineFeaturesControl,
        uncombine_features: this.props.uncombineFeaturesControl
      },
      displayControlsDefault: this.props.displayControlsDefault,
      styles: this.props.styles,
      modes: this.props.modes,
      defaultMode: this.props.defaultMode,
      userProperties: this.props.userProperties
    }, this.props.position);

    map.addControl(draw);

    events.forEach((event) => {
      const propName = `on${capitalizeFirstLetter(event)}`;
      if (this.props[propName]) {
        map.on(event, this.props[propName]);
      }
    });

    draw.add(this.props.data);

    // $FlowFixMe
    this._draw = draw;
  }

  componentDidUpdate() {
    // $FlowFixMe
    this._draw.set(this.props.data);
  }

  render() {
    return React.createElement(MapContext.Consumer, {}, (map) => {
      if (map) {
        // $FlowFixMe
        this._map = map;
      }
      return null;
    });
  }
}

export default Draw;
