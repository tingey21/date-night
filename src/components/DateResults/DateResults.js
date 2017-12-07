import React, { Component } from 'react';
import axios from 'axios';

// components
import Date from './Date';

// redux
import { connect } from 'react-redux';
import { getResults, clearResults } from '../../ducks/reducer';

class DateResults extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      lockedCategories: [],
      businesses: [],
      lockedBusinesses: []
    }
  }

  // initializes state (which sets off the first randomizer method)
  componentDidMount() {
    this.initState();
  }

  // sets state to appropriate length for all 4 arrays
  initState() {
    let durations = { 'short': 1, 'medium': 2, 'long': 3 };
    let locked = [], businesses = [], categories = [];
    for (let i = durations[this.props.preferences.duration]; i > 0; i--) {
      locked.push(false);
      categories.push('');
      businesses.push(null);
    }
    this.setState({ categories, businesses, lockedCategories: locked, lockedBusinesses: locked }, () => {
      this.refreshDate();
    });
  }

  // this function sets off all the callback methods to update state
  // called in initState and whenever they press the refresh button
  refreshDate() {
    this.getRandomCategories(this.props.preferences.startTime);    
  }

  updateBusinesses() {
    console.log('update our businesses with these categories:\n', this.state.categories);
  }

  // selects appropriate number of random categories for startime
  getRandomCategories(startTime) {
    let newCategories = [...this.state.categories];
    // only get a random category when category at that index is not locked
    this.state.lockedCategories.forEach((locked, index) => {
      if (!locked) {
        newCategories[index] = this.randomCategory(startTime);
      }
      startTime += 200;         
    });
    // after updateing categories, get new business with those keywords
    this.setState({ categories: newCategories }, () => {
      this.updateBusinesses();
    });
  }

  // return one random category given a start time
  randomCategory(startTime) {
    let time = '';
    // set time to the correct key for categories object
    if (630 < startTime && startTime < 1800) {
      time = 'day';
    } else {
      time = 'night';
    }
    // push a random category string to the categories array
    let mainCategories = this.props.categories[time];
    let randIndex = Math.floor(Math.random() * mainCategories.length)
    return mainCategories[randIndex];
  }

  // given an index, updates lockedBusinesses at that index
  lockBusiness(index) {
    let lockedBusinesses = [...this.state.businesses];
    lockedBusinesses[index] = true;
    this.setState({ lockedBusinesses });
  }

  // given an index and a subcategory, update categories AND lockedCategories
  // at that index
  lockCategory(index, newCategory) {
    let lockedCategories = [...this.state.lockedCategories];
    let categories = [...this.state.categories];
    lockedCategories[index] = !lockedCategories[index];
    if (lockedCategories[index]) { categories[index] = newCategory };
    this.setState({ lockedCategories, categories });
  }

  render() {
    console.log('CATEGORIES:', this.state.categories);
    return (
      <div className='date-results'>
        <h1>All results from our date search</h1>
        {/* render several date components here */}
        <button onClick={ () => this.refreshDate() }>Give me some dates!!!</button>
        <button onClick={ () => this.lockCategory(0, '1 locked!!!') }>Lock category #1</button>
        <button onClick={ () => this.lockCategory(1, '2 locked!!!') }>Lock category #2</button>
        <button onClick={ () => this.lockCategory(2, '3 locked!!!') }>Lock category #3</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { 
    results: state.results, 
    categories: state.categories ,
    preferences: state.preferences,
  };
}

export default connect(mapStateToProps, { getResults, clearResults })(DateResults);