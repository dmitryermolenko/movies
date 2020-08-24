import React from 'react';
import PropTypes from 'prop-types';
import Movie from '../Movie/Movie';

const MovieList = (props) => {
  const { movieList, guestSessionID, updateRating } = props;
  const movies = movieList.map((movie) => {
    return (
      <li key={movie.id} className="film-list__item">
        <Movie movie={movie} guestSessionID={guestSessionID} updateRating={updateRating} />
      </li>
    );
  });

  return <ul className="film-list">{movies}</ul>;
};

export default MovieList;

MovieList.propTypes = {
  movieList: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
  guestSessionID: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
};
