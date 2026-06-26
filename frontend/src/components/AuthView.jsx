import React, { useState } from 'react';
import { Compass, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthView({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? 'signup' : 'signin';
    const payload = isSignUp 
      ? { name: name.trim(), username: username.trim(), password }
      : { username: username.trim(), password };

    try {
      const response = await fetch(`http://localhost:8081/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store in localStorage & notify App
      localStorage.setItem('travel_buddy_user', JSON.stringify(data));
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 10% 20%, rgba(214, 90, 49, 0.12) 0%, rgba(22, 38, 33, 0.95) 90%), #162621',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem 2rem',
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}>
        {/* Brand Logo */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <Compass size={32} style={{ color: 'var(--accent)', animation: 'spinCompass 15s linear infinite' }} />
          <h1 style={{
            fontSize: '1.6rem',
            margin: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'var(--accent)',
            letterSpacing: '0.5px'
          }}>
            Smart India Explorer
          </h1>
        </div>

        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.85rem',
          marginBottom: '2rem',
          lineHeight: '1.4'
        }}>
          {isSignUp 
            ? 'Create an account to plan custom itineraries and explore India safely.'
            : 'Welcome back! Sign in to access your personal digital travel buddy.'}
        </p>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: !isSignUp ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              fontSize: '0.85rem',
              borderRadius: '6px'
            }}
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              background: isSignUp ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              fontSize: '0.85rem',
              borderRadius: '6px'
            }}
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {isSignUp && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }} htmlFor="auth-name">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-name"
                  type="text"
                  className="form-control"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    paddingLeft: '2.5rem'
                  }}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }} htmlFor="auth-username">
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-username"
                type="text"
                className="form-control"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  paddingLeft: '2.5rem'
                }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }} htmlFor="auth-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="auth-password"
                type="password"
                className="form-control"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  paddingLeft: '2.5rem'
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }} />
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(225, 29, 72, 0.15)',
              borderLeft: '3px solid var(--danger)',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              color: '#fda4af',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              lineHeight: '1.4'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.95rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Start Exploring')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
          <span>Secure local authentication credentials</span>
        </div>
      </div>

      <style>{`
        @keyframes spinCompass {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
