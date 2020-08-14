import React, { Component } from 'react';
import MovieList from '../MovieList/MovieList';
import MovieService from '../MovieService/MovieService';
/* import './App.css'; */

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };

    this.movieService = new MovieService();
  }

  componentDidMount() {
    this.movieService.getResource().then(({ results }) => {
      this.setState({ data: results });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <main>
        <section className="films">
          <MovieList movieList={data} />
        </section>
      </main>
    );
  }
}
