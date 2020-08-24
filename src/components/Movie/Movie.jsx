import React, { Component } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import trimText from '../../util/util';
import noPoster from '../../images/no-image.jpg';
import MovieService from '../MovieService/MovieService';

const TRIM_LIMIT = 250;

export default class Movie extends Component {
  constructor() {
    super();
    this.baseUrl = 'https://image.tmdb.org/t/p/';
    this.fileSize = 'w500/';
    this.movieService = new MovieService();
  }

  rateMovies = (rating) => {
    const {
      movie,
      movie: { id },
      guestSessionID,
      updateRating,
    } = this.props;
    this.movieService.postMovieRating(id, guestSessionID, rating).then(() => updateRating(movie, rating));
  };

  render() {
    const {
      movie: { poster_path: poster, vote_average: averageRating, title, rating },
    } = this.props;
    let {
      movie: { release_date: release, overview },
    } = this.props;

    overview = trimText(overview, TRIM_LIMIT);
    release =
      release === '' || release === undefined ? Movie.defaultProps.release_date : format(new Date(release), 'PP');

    const posterPath = poster ? `${this.baseUrl}${this.fileSize}${poster}` : noPoster;

    // eslint-disable-next-line no-nested-ternary
    const ratingColor =
      averageRating <= 3 ? 'law' : averageRating <= 5 ? 'middle' : averageRating <= 7 ? 'high' : 'top';

    return (
      <article className="film-card">
        <img src={posterPath} alt="" className="film-card__poster" />
        <div className="film-card__info-container">
          <div className="film-card__info-container-top">
            <h2 className="film-card__title">{title}</h2>
            <span className={`film-card__rating film-card__rating--${ratingColor}`}>{averageRating}</span>
          </div>
          <span className="film-card__release">{release}</span>
          <span className="film-card__genre" />
          <p className="film-card__description">{overview}</p>
          <Rate count={10} value={rating} allowHalf onChange={this.rateMovies} />
        </div>
      </article>
    );
  }
}

Movie.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  movie: PropTypes.object.isRequired,
  release_date: PropTypes.string,
  guestSessionID: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
};

Movie.defaultProps = {
  release_date: '',
};
