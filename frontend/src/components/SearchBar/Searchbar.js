// src/components/SearchBar/SearchBar.js
import React from 'react';
import './Searchbar.css';

const SearchBar = ({ onSearch, onFilterChange, filters }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => onSearch(e.target.value)}
      />
      <select onChange={(e) => onFilterChange('tipo', e.target.value)}>
        {filters.tipo.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select onChange={(e) => onFilterChange('filtro', e.target.value)}>
        {filters.filtro.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={onSearch}>Buscar</button>
    </div>
  );
};

export default SearchBar;
