import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL, { Source, Layer } from 'react-map-gl';
import ControlPanel from './control-panel';
import data2 from './data.json';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { dataLayer } from './map-style.js';
import { updatePercentiles } from './utils';
import { json as requestJson } from 'd3-request';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmxhdmlhMTk5NzEiLCJhIjoiY2s4enppeXV4MDBrYTNlbnR3aHBndXdiciJ9.UR8xF-MdU1TvYc2gKiXXeA'; // Set your mapbox token here

export default class App extends Component {
  state = {
    year: 2015,
    data: null,
    hoveredFeature: null,
    viewport: {
      latitude: 45.71,
      longitude: 21.21,
      zoom: 9,
      bearing: 0,
      pitch: 0
    }
  };

  componentDidMount() {
    requestJson(
      'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson',
      (error, response) => {
        if (!error) {
          this._loadData(data2);
        }
      }
    );
  }

  _loadData = data => {
    this.setState({
      data: updatePercentiles(data, f => 43973)
    });
  };

  _updateSettings = (name, value) => {
    if (name === 'year') {
      this.setState({ year: value });

      const { data } = this.state;
      if (data) {
        // trigger update
        this.setState({
          data: updatePercentiles(data, f => 43973)
        });
      }
    }
  };

  _onViewportChange = viewport => this.setState({ viewport });

  _onHover = event => {
    const {
      features,
      srcEvent: { offsetX, offsetY }
    } = event;
    const hoveredFeature = features && features.find(f => f.layer.id === 'data');

    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  _renderTooltip() {
    const { hoveredFeature, x, y } = this.state;

    return (
      hoveredFeature && (
        <div className="tooltip" style={{ left: x, top: y }}>
          <div>State: {hoveredFeature.properties.name}</div>
          <div>Median Household Income: {hoveredFeature.properties.value}</div>
          <div>Percentile: {(hoveredFeature.properties.percentile / 8) * 100}</div>
        </div>
      )
    );
  }

  render() {
    const { viewport, data } = this.state;
    console.log(data);
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <AppBar position="absolute" style={{ background: '#000' }}>
          <Toolbar>
            <Typography variant="h6" >
              COVID-19
                </Typography>
          </Toolbar>
        </AppBar>
        
        <MapGL 
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/light-v9"
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this._onHover}
        >
          <Source type="geojson" data={data}>
            <Layer {...dataLayer} />
          </Source>
          {this._renderTooltip()}
        </MapGL>
          <ControlPanel
          containerComponent={this.props.containerComponent}
          settings={this.state}
          onChange={this._updateSettings}
        />
      </div>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
