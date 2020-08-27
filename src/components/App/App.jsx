import React, { Component } from 'react';
import { Spin, Alert, Input, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';
import MovieList from '../MovieList/MovieList';
import MovieService from '../MovieService/MovieService';
import { GenreProvider } from '../GenreContext/GenreContext';

const DELAYED_TIME = 500;
const { TabPane } = Tabs;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      guestSessionID: null,
      data: null,
      isLoading: false,
      hasError: false,
      searchText: null,
      totalItems: null,
      currentPage: null,
      isFirstLoading: true,
      hasData: false,
      totalRatedItems: null,
      ratedData: null,
      isRatedMode: false,
    };

    this.cache = {};
    this.genres = null;

    this.movieService = new MovieService();
  }

  componentDidMount() {
    this.movieService
      .getGuestSessionID()
      .then(({ guest_session_id: guestSessionID }) => this.setState({ guestSessionID }));
    setTimeout(() => this.setState({ isFirstLoading: false }), 1000);

    // eslint-disable-next-line no-return-assign
    this.movieService.getGenres().then((genres) => {
      this.genres = genres.reduce((acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {});
    });
  }

  onDataLoad = (receivedData) => {
    const { results, total_results: totalItems, page } = receivedData;
    const updatedResults = this.updateData(results, this.cache);

    this.setState({
      data: updatedResults,
      totalItems,
      currentPage: page,
      isLoading: false,
      hasError: false,
      hasData: !!results.length,
    });
  };

  onRatedDataLoad = (receivedData) => {
    const { results, total_results: totalRatedItems, page } = receivedData;
    this.setState({
      ratedData: results,
      totalRatedItems,
      currentPage: page,
      isRatedMode: true,
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
    const { isRatedMode } = this.state;
    const activePage = document.querySelector('.ant-pagination-item-active');
    activePage.classList.remove('ant-pagination-item-active');

    if (isRatedMode) {
      this.rateMovies(current);
    } else {
      const { searchText } = this.state;
      this.getMovies(searchText, current);
    }
  };

  getMovies = debounce((value, queryPage) => {
    this.setState({
      isLoading: true,
      hasData: false,
      data: null,
      totalItems: null,
      currentPage: null,
      isRatedMode: false,
    });
    this.movieService.getResource(value, queryPage).then(this.onDataLoad).catch(this.onGetError);
  }, DELAYED_TIME);

  rateMovies = (current = 1) => {
    const { guestSessionID } = this.state;
    this.movieService.getRatedMovies(guestSessionID, current).then((body) => this.onRatedDataLoad(body));
  };

  toggleRatedMode = (activeKey) => {
    if (activeKey === 'rated') {
      this.rateMovies();
    } else {
      const { isRatedMode } = this.state;
      this.setState(() => ({ isRatedMode: !isRatedMode }));
    }
  };

  updateRating = (movie, rating) => {
    const { data, ratedData, isRatedMode } = this.state;
    this.cache[movie.id] = { ...movie, rating };

    const updatedData = this.updateData(data, this.cache);

    if (isRatedMode) {
      const updatedRatedData = this.updateData(ratedData, this.cache);
      this.setState(() => ({ data: updatedData, ratedData: updatedRatedData }));
      return;
    }

    this.setState(() => ({ data: updatedData }));
  };

  updateData = (data, cache) => {
    for (const key in cache) {
      if (!Object.prototype.hasOwnProperty.call(cache, key)) {
        return data;
      }
    }

    return data.map((movie) => cache[movie.id] || movie);
  };

  render() {
    const {
      guestSessionID,
      data,
      ratedData,
      totalItems,
      totalRatedItems,
      currentPage,
      isLoading,
      hasError,
      searchText,
      isFirstLoading,
      hasData,
      isRatedMode,
    } = this.state;

    if (isFirstLoading) {
      return <Spin className="spin" tip="Loading..." size="large" />;
    }

    return (
      <main className="main">
        <Tabs
          defaultActiveKey="search"
          activeKey={isRatedMode ? 'rated' : 'search'}
          centered
          onChange={this.toggleRatedMode}
        >
          <TabPane tab="Search" key="search" />
          <TabPane tab="Rated" key="rated" />
        </Tabs>
        {!isRatedMode && (
          <Input placeholder="Type to search..." style={{ height: 50 }} value={searchText} onChange={this.onChange} />
        )}
        <section className="films">
          {isLoading && <Spin className="spin" tip="Loading..." size="large" />}
          {hasData && (
            <GenreProvider value={this.genres}>
              <MovieList
                movieList={isRatedMode ? ratedData : data}
                guestSessionID={guestSessionID}
                isLoaded={isLoading}
                hasError={hasError}
                onRate={this.rateMovies}
                updateRating={this.updateRating}
              />
            </GenreProvider>
          )}
          {!hasData && !isLoading && data && (
            <Alert className="error-message" message="Not found. Try again" type="info" />
          )}
        </section>
        {hasData && (
          <Pagination
            showSizeChanger={false}
            current={currentPage}
            pageSize={20}
            total={isRatedMode ? totalRatedItems : totalItems}
            onChange={this.onPageChange}
          />
        )}
      </main>
    );
  }
}
