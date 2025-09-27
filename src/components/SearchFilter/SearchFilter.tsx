import React from 'react';
import './SearchFilter.css';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
}

/**
 * Componente de filtro de búsqueda para podcasts
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  totalCount,
}) => {
  return (
    <div className="search-filter">
      <div className="search-filter__counter">{totalCount}</div>

      <div className="search-filter__input-container">
        <input
          type="text"
          className="search-filter__input"
          placeholder="Filter podcasts..."
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Filter podcasts by name or author"
        />
      </div>
    </div>
  );
};

export default SearchFilter;
