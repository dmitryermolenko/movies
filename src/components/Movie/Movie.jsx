import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import trimText from '../../util/util';
import noPoster from '../../images/no-image.jpg';

const TRIM_LIMIT = 250;

export default class Movie extends Component {
  constructor() {
    super();
    this.baseUrl = 'https://image.tmdb.org/t/p/';
    this.fileSize = 'w500/';
  }

  render() {
    const {
      movie: { poster_path: poster, title },
    } = this.props;
    let {
      movie: { release_date: release },
    } = this.props;
    let {
      movie: { overview },
    } = this.props;

    overview = trimText(overview, TRIM_LIMIT);
    release =
      release === '' || release === undefined ? Movie.defaultProps.release_date : format(new Date(release), 'PP');

    const posterPath = poster ? `${this.baseUrl}${this.fileSize}${poster}` : noPoster;

    return (
      <article className="film-card">
        <img src={posterPath} alt="" className="film-card__poster" />
        <div className="film-card__info-container">
          <h2 className="film-card__title">{title}</h2>
          <span className="film-card__release">{release}</span>
          <span className="film-card__genre" />
          <p className="film-card__description">{overview}</p>
        </div>
      </article>
    );
  }
}

Movie.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  movie: PropTypes.object.isRequired,
};

Movie.propTypes = {
  release_date: PropTypes.string,
};

Movie.defaultProps = {
  release_date: '',
};
