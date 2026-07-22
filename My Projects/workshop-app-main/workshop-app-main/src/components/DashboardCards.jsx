function DashboardCards({ stats }) {
  const workshopNames = Object.keys(stats.workshops);

  return (
    <div className="cards-grid">
      <article className="stat-card">
        <span>Total participants</span>
        <strong>{stats.total}</strong>
      </article>
      <article className="stat-card">
        <span>Female</span>
        <strong>{stats.female}</strong>
      </article>
      <article className="stat-card">
        <span>Male</span>
        <strong>{stats.male}</strong>
      </article>
      <article className="stat-card">
        <span>Other</span>
        <strong>{stats.other}</strong>
      </article>
      {workshopNames.map((workshop) => (
        <article key={workshop} className="stat-card">
          <span>{workshop}</span>
          <strong>{stats.workshops[workshop]}</strong>
        </article>
      ))}
    </div>
  );
}

export default DashboardCards;
