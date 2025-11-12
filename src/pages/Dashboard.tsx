import Icon from '../components/Icons';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">ការកក់សរុប</div>
            <div className="stat-icon">
              <Icon name="calendar" size={24} />
            </div>
          </div>
          <div className="stat-value">247</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">អ្នកប្រើថ្មីៗ</div>
            <div className="stat-icon">
              <Icon name="profile" size={24} />
            </div>
          </div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">សេវាកម្មកំពុងដំណើរការ</div>
            <div className="stat-icon">
              <Icon name="service" size={24} />
            </div>
          </div>
          <div className="stat-value">2</div>
        </div>
      </section>

      <section className="revenue">
        <div className="revenue-header">
          <div className="revenue-title">ចំណូល (ខែ)</div>
          <div className="revenue-icon">
            <Icon name="calendar" size={24} />
          </div>
        </div>
        <div className="revenue-value">$24,580</div>
      </section>

      <section className="recent">
        <div className="recent-title">ការកក់ថ្មីៗ</div>
        <div className="card-list">
          {[1,2,3].map((i) => (
            <article className="task-card" key={i}>
              <div className="task-main">
                <div className="task-name">Sarah Wilson</div>
                <div className="task-sub">សម្អាតផ្ទៃក្នុង</div>
              </div>
              <div className="task-meta">
                <div className="task-date">2025-10-15</div>
                <span className={`task-badge ${i === 1 ? 'pending' : 'success'}`}>
                  {i === 1 ? 'pending' : 'done'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}