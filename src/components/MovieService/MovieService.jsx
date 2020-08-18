import { Component } from 'react';

export default class MovieService extends Component {
  constructor() {
    super();
    this.apiBase = 'https://api.themoviedb.org/3/search/movie?api_key=aec96291b4add0d3139346ca39206d6f&query=';
  }

  async getResource(keyWord, queryPage = 1) {
    const response = await fetch(`${this.apiBase}${keyWord}&page=${queryPage}`);
    if (response.ok) {
      const body = await response.json();
      return body;
    }

    throw new Error();
  }
}
