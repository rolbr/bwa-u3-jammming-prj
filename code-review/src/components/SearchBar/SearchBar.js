import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  constructor(props){
    super(props);

    this.state = {
      term: null,
    }

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  search(){
    if( !this.state.term ) return;

    this.props.onSearch( this.state.term );
  }

  handleTermChange( e ){
    // this.search( e.target.value );
    this.setState({
      term: e.target.value,
    })
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <a onClick={this.search}> SEARCH </a>
      </div>
    );
  }
}

export default SearchBar;