import { Component } from 'react';

export default class MovieService extends Component {
  constructor() {
    super();
    this.apiBase = 'https://api.themoviedb.org/3';
    this.apiKey = 'api_key=aec96291b4add0d3139346ca39206d6f';
    this.searchEndPoint = '/search/movie?';
    this.guestSessionEndPoint = '/authentication/guest_session/new?';
    this.rateMovieEndPoint = '/movie/';
    this.getRatedMoviesEndPoint = '/guest_session/{guest_session_id}/rated/movies';
  }

  async getResource(keyWord, queryPage = 1) {
    const response = await fetch(
      `${this.apiBase}${this.searchEndPoint}${this.apiKey}&query=${keyWord}&page=${queryPage}`
    );
    if (response.ok) {
      const body = await response.json();
      return body;
    }

    throw new Error();
  }

  async getGuestSessionID() {
    const response = await fetch(`${this.apiBase}${this.guestSessionEndPoint}${this.apiKey}`);
    if (response.ok) {
      const body = await response.json();
      return body;
    }

    throw new Error();
  }

  async getRatedMovies(guestSessionID, currentPage) {
    const response = await fetch(
      `${this.apiBase}/guest_session/${guestSessionID}/rated/movies?${this.apiKey}&page=${currentPage}`
    );
    if (response.ok) {
      const body = await response.json();
      return body;
    }

    throw new Error();
  }

  async postMovieRating(movieId, getGuestSessionID, rating) {
    const response = await fetch(
      `${this.apiBase}${this.rateMovieEndPoint}${movieId}/rating?${this.apiKey}&guest_session_id=${getGuestSessionID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );

    if (!response.ok) {
      throw new Error();
    }
  }
}
