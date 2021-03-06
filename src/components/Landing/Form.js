import React, { Component } from 'react';
import { addPreferences, addHotAndNew } from '../../ducks/reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Slider from 'material-ui/Slider';

const marginStyle = {
  marginLeft: 18,
  marginRight: 18,
  width: 300
};

const marginState = {
  marginLeft: 18,
  marginRight: 18,
  width: 135
}


class Form extends Component {
  constructor() {
    super()
    this.state = {
      buttonClick: '',
      longitude: '',
      latitude: '',
      secondSlider: 10,
      errorLocation: false,
      hotAndNew: []
    }
    this.getLocation = this.getLocation.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }


  handleSecondSlider = (event, value) => {
    this.setState({ secondSlider: value });

  };


  getLocation() {
    navigator.geolocation.getCurrentPosition(location => {
      // const { latitude, longitude } = location.coords;
      let latitude = 40.2388, longitude = 111.6585;
      axios.get(`http://localhost:4200/api/yelp/hotandnew/${latitude}/${longitude}`)
           .then(res => {
              let businesses = res.data.businesses;
              let keys = Object.keys(businesses), hotAndNew = [];
              for (let i = 0; i < 10; i++) {
                hotAndNew.push(businesses[keys[i]]);
              }            
              this.props.addHotAndNew(hotAndNew);
            })
           .catch(err => console.log(err));
    });
  }

  createDate() {
    let time = this.refs.startTime.refs.input.input.value;
    let date = this.refs.startDate.refs.input.input.value;
    let location = undefined;
    if(this.refs.city.input.value && this.refs.state.input.value){
     location = this.refs.city.input.value + ',' + this.refs.state.input.value;
}

    if (time.includes('pm')) {

      time = time.replace(" pm", "").replace(":", '');
      time = parseFloat(time)
      //check if time is less than twelve   
      if (time < 1200) {
        //checks if is a single digit with two trailing zeros is less than 12 ex: 1:00 becomes 1
        if (time < 12) {
          time = time * 10 + 1200
        }
        time = time + 1200
      }
    }
    else {

      time = time.replace(" pm", "").replace(":", '');
      time = parseFloat(time)



      if (time < 12) {
        time = time * 100

      }
      if (time === 12) {
        time = 0
      }

      if (time > 1200 && time < 1261) {
        time = time - 1200
      }

    }
    var milesToMeters = Math.round(this.state.secondSlider) * 1609.34
    milesToMeters = parseInt(milesToMeters, 10)
    if (milesToMeters > 40000) {
      milesToMeters = 40000
    }
    
    if (location) {
      let preferences = {
        startDate: date,
        startTime: time || 1200,
        duration: this.state.buttonClick || 'long',
        location: this.refs.city.getValue() + ',' + this.refs.state.getValue(),
        radius: milesToMeters
      }

      this.props.addPreferences(preferences)
      this.props.history.push("/results")
    }

    else if (!location) {
      console.error('No location')
    }
  }



  render() {

    return (
      <div className="date-form" id="createform">
        <div className="text-wrapper-form">
          <h5 className="form-title">CREATE YOUR PERFECT DATE!</h5>
        </div>
        <h3>START DATE:</h3>
        <DatePicker style={marginStyle}
          ref='startDate'
          hintText="01/12/2017" />
        <h3>START TIME:</h3>
        <TimePicker style={marginStyle}

          ref='startTime'
          hintText="12hr Format" />
        <h3>LENGTH:</h3>
        <div className="btn-length">
          <h4 className="gray-text subtitle-short">1 HOUR</h4>
          <button id={this.state.buttonClick==='short' ? "isBlue" : null} className="second-btn btn-short" onClick={() => this.setState({ buttonClick: "short" })}>SHORT</button>
          <h4 className="gray-text subtitle-medium">2-3 HOURS</h4>
          <button id={this.state.buttonClick==='medium' ? "isBlue" : null} className="second-btn btn-medium" onClick={() => this.setState({ buttonClick: "medium" })}>MEDIUM</button>
          <h4 className="gray-text subtitle-long">4+ HOURS</h4>
          <button id={this.state.buttonClick==='long' ? "isBlue" : null} className="second-btn btn-long" onClick={() => this.setState({ buttonClick: "long" })}>LONG</button>
        </div>
        <h3>LOCATION:</h3>

        <TextField style={marginState}
          ref="city"
          hintText="Provo"
          def
        />

        <TextField style={marginState}
          ref="state"
          hintText="UT"
        />

        <h3>RADIUS: {this.state.secondSlider} miles</h3>
        <Slider 
          style={marginStyle}
          min={1}
          max={25}
          step={1}
          value={this.state.secondSlider}
          onChange={this.handleSecondSlider}
        />



        <button className="main-btn create-btn" onClick={() => { this.createDate() }}>CREATE</button>
      </div >
    );
  }
}

function mapStateToProps(state) {
  return {
    preferences: state.preferences
  }

}
export default withRouter(connect(mapStateToProps, { addPreferences, addHotAndNew })(Form))
