import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) {
      setError('សូមបញ្ចូល ឈ្មោះ ');
      return;
    }
    if (!password.trim()) {
    setError('សូមបញ្ចូល ពាក្យសម្ងាត់');
    return;
    }

    navigate('/dashboard');
  }

  return (
    <div className="login-wrapper">
      <div className="login-card" role="main">
        <div className="logo-wrap">
          <img src="/MR-LUBE.png" alt="MR-LUBE Logo" className="logo-image" />
        </div>
        <h1 className="login-title">សូមចូលគណនី</h1>
        <p className="login-sub">បញ្ចូលឈ្មោះនិងពាក្យសម្ងាត់ដើម្បីចូល</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <input
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); }}
              placeholder="ឈ្មោះ "
              className="input"
              aria-label="name"
            />
          </label>

          <label className="field">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              placeholder="ពាក្យសម្ងាត់"
              className="input"
              aria-label="password"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn primary">ចូលគណនី</button>


        </form>
      </div>
    </div>
  );
}
