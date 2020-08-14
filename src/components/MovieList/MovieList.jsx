import React from 'react';
import PropTypes from 'prop-types';
import Movie from '../Movie/Movie';

const MovieList = (props) => {
  const { movieList } = props;

  const movies = movieList.map((movie) => {
    return (
      <li key={movie.id} className="film-list__item">
        <Movie movie={movie} />
      </li>
    );
  });
  return <ul className="film-list">{movies}</ul>;
};

MovieList.propTypes = {
  movieList: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

export default MovieList;
