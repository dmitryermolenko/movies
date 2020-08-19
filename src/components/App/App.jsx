import React, { Component } from 'react';
import { Spin, Alert, Input, Pagination } from 'antd';
import { debounce } from 'lodash';
import MovieList from '../MovieList/MovieList';
import MovieService from '../MovieService/MovieService';

const DELAYED_TIME = 500;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      isLoading: false,
      hasError: false,
      searchText: '',
      totalItems: null,
      currentPage: null,
      isFirstLoading: true,
      hasData: false,
    };

    this.movieService = new MovieService();
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isFirstLoading: false }), 1000);
  }

  onDataLoad = (receivedData) => {
    const { results, total_results: totalItems, page } = receivedData;
    this.setState({
      data: results,
      totalItems,
      currentPage: page,
      isLoading: false,
      hasError: false,
      hasData: !!results.length,
    });
  };

  onGetError = () => {
    this.setState({ isLoading: false, hasError: true });
  };

  onChange = (evt) => {
    const { value } = evt.target;
    this.setState({ searchText: value });
    this.getMovies(value);
  };

  onPageChange = (current) => {
    const activePage = document.querySelector('.ant-pagination-item-active');
    activePage.classList.remove('ant-pagination-item-active');

    const { searchText } = this.state;
    this.getMovies(searchText, current);
  };

  getMovies = debounce((value, queryPage) => {
    this.setState({ isLoading: true, hasData: false, data: null, totalItems: null, currentPage: null });
    this.movieService.getResource(value, queryPage).then(this.onDataLoad).catch(this.onGetError);
  }, DELAYED_TIME);

  render() {
    const { data, totalItems, currentPage, isLoading, hasError, searchText, isFirstLoading, hasData } = this.state;
    const spinner = isLoading ? <Spin className="spin" tip="Loading..." size="large" /> : null;
    const content = hasData ? <MovieList movieList={data} isLoaded={isLoading} hasError={hasError} /> : null;
    const pagination = hasData ? (
      <Pagination showSizeChanger current={currentPage} pageSize={20} total={totalItems} onChange={this.onPageChange} />
    ) : null;
    const errorMessage =
      !hasData && !isLoading && data ? (
        <Alert className="error-message" message="Not found. Try again" type="info" />
      ) : null;

    if (isFirstLoading) {
      return <Spin className="spin" tip="Loading..." size="large" />;
    }

    return (
      <main className="main">
        <Input placeholder="Type to search..." style={{ height: 50 }} value={searchText} onChange={this.onChange} />
        <section className="films">
          {spinner}
          {content}
          {errorMessage}
        </section>
        {pagination}
      </main>
    );
  }
}
