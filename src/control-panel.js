import React, {PureComponent} from 'react';
import Card from '@material-ui/core/Card';

export default class ControlPanel extends PureComponent {
  render() {
    const {settings} = this.props;

    return (
      <div >
        <Card className="control-panel"  style={{marginTop:'100px', background:'rgba(00, 00, 00, 0.8)', color:'#FFF'}}>
        <h3>Interactive GeoJSON</h3>
        <div key={'year'} className="input">
          <label>Year</label>
          <input
            type="range"
            value={settings.year}
            min={1995}
            max={2015}
            step={1}
            onChange={evt => this.props.onChange('year', evt.target.value)}
          />
        </div>
        </Card>
      
      

     
      </div>
    );
  }
}
