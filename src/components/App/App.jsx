import React, { Component } from 'react';
import { Spin, Alert } from 'antd';
import MovieList from '../MovieList/MovieList';
import MovieService from '../MovieService/MovieService';
/* import './App.css'; */

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      isLoading: true,
      hasError: false,
    };

    this.movieService = new MovieService();
  }

  componentDidMount() {
    this.movieService.getResource().then(this.onDataLoad).catch(this.onGetError);
  }

  onDataLoad = (receivedData) => {
    const { results } = receivedData;
    this.setState({ data: results, isLoading: false, hasError: false });
  };

  onGetError = () => {
    this.setState({ isLoading: false, hasError: true });
  };

  render() {
    const { data, isLoading, hasError } = this.state;
    const hasData = !(isLoading || hasError);
    const spinner = isLoading ? <Spin className="spin" tip="Loading..." size="large" /> : null;
    const content = hasData ? <MovieList movieList={data} isLoaded={isLoading} hasError={hasError} /> : null;
    const errorMessage = hasError ? (
      <Alert className="error-message" message="Not found. Try again" type="info" />
    ) : null;
    return (
      <main>
        <section className="films">
          {spinner}
          {content}
          {errorMessage}
        </section>
      </main>
    );
  }
}
