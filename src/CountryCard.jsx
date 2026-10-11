function CountryCard({ country, isFavorite, onToggle }) {
  return (
    <div className="card">
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <div className="card-body">
        <h3>{country.name.common}</h3>
        <p>{country.region}</p>
        <p>{country.population.toLocaleString()} people</p>
      </div>
      <button
        className={isFavorite ? 'star active' : 'star'}
        onClick={() => onToggle(country.cca3)}
      >
        ★
      </button>
    </div>
  );
}

export default CountryCard;