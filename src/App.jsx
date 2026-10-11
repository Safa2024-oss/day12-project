import { useState, useEffect } from 'react';
import CountryCard from './CountryCard';
import './App.css';

const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,region,population,cca3'
        );
        if (!response.ok) throw new Error('Failed to load countries');
        const data = await response.json();
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(code) {
    if (favorites.includes(code)) {
      setFavorites(favorites.filter((c) => c !== code));
    } else {
      setFavorites([...favorites, code]);
    }
  }

  const visibleCountries = countries
    .filter((c) => c.name.common.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => region === 'All' || c.region === region)
    .filter((c) => !showFavorites || favorites.includes(c.cca3));

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="app">
      <h1>Countries Explorer</h1>

      <div className="controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a country..."
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {REGIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button
          className={showFavorites ? 'fav-toggle active' : 'fav-toggle'}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          ★ Favorites ({favorites.length})
        </button>
      </div>

      <p className="count">{visibleCountries.length} countries</p>

      {visibleCountries.length === 0 ? (
        <p className="status">No countries match.</p>
      ) : (
        <div className="grid">
          {visibleCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
              isFavorite={favorites.includes(country.cca3)}
              onToggle={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;