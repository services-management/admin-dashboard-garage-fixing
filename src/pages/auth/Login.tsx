import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { adminLogin } from '../../store/auth/authThunk';
import '../../styles/login.css';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError('');

    if (!identifier.trim()) {
      setLocalError('សូមបញ្ចូល ឈ្មោះ');
      return;
    }
    if (!password.trim()) {
      setLocalError('សូមបញ្ចូល ពាក្យសម្ងាត់');
      return;
    }

    const result = await dispatch(adminLogin({ identifier, password }));

    if (adminLogin.fulfilled.match(result)) {
      void navigate('/dashboard');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="/MR-LUBE.png" className="logo-image" />
        <h1>ចូលគណនីរបស់អ្នក</h1>
        <p>បញ្ចូលឈ្មោះ និងពាក្យសម្ងាត់របស់អ្នក។</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="ឈ្មោះ"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ពាក្យសម្ងាត់"
          />

          {(localError || error) && <div className="error">{localError || error}</div>}

          <button disabled={loading}>{loading ? 'កំពុងចូល...' : 'ចូលគណនី'}</button>
        </form>
      </div>
    </div>
  );
}
