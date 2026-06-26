import React from 'react';
import { Compass, Map, Languages, Utensils, Shield, Sparkles, Train, Search, ArrowRight } from 'lucide-react';

export default function HomeView({ regions, selectedRegionId, onSelectRegion, setActiveTab }) {
  const selectedRegion = regions.find(r => r.id === selectedRegionId);

  return (
    <div className="fade-in">
      {/* Hero Welcome Banner */}
      <div className="hero-card">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Namaste - Welcome to India</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', lineHeight: '1.2' }}>
          Smart India Explorer
        </h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '600px', marginBottom: '2rem' }}>
          Navigate safely, explore regional tastes, translate local languages, and plan your journey with one single companion.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => setActiveTab('itinerary')}>
            Trip Planner
            <ArrowRight size={16} />
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }} 
            onClick={() => setActiveTab('safety')}
          >
            Safety Center
          </button>
        </div>
      </div>

      {/* Regional Quick Information */}
      <div className="glass-panel mb-2" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <Search size={20} style={{ color: 'var(--primary)' }} />
          Choose Destination
        </h2>
        <div className="flex gap-2 align-center flex-wrap" style={{ marginBottom: '1.5rem' }}>
          <select
            id="region-select"
            className="form-control"
            style={{ width: '250px' }}
            value={selectedRegionId}
            onChange={(e) => onSelectRegion(e.target.value)}
          >
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {selectedRegion && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                {selectedRegion.name}
              </h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {selectedRegion.description}
              </p>
              <div className="flex gap-2">
                <span className="status-badge status-badge-primary">Capital: {selectedRegion.capital}</span>
                <span className="status-badge status-badge-secondary">
                  Languages: {selectedRegion.languages ? selectedRegion.languages.join(', ') : 'Hindi'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('culture')}>
                Customs
              </button>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('food')}>
                Food Guide
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Grid */}
      <h2 style={{ margin: '1.75rem 0 1rem', fontSize: '1.25rem' }}>Features</h2>
      <div className="grid-3">
        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('itinerary')}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Map size={20} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Trip Planner</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Get custom day schedules based on your days, budget, and travel interests.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('navigation')}>
          <div style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Compass size={20} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Camera Map</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Scan spots to overlay walk directions and ratings directly on your screen.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('translation')}>
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Languages size={20} style={{ color: '#dca134' }} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Translator</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Translate local languages and play audio voice output directly to locals.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('food')}>
          <div style={{ background: '#fef2f2', color: 'var(--danger)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Utensils size={20} style={{ color: '#ef4444' }} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Food Guide</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Browse local food choices with allergen warnings and street hygiene advice.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('safety')}>
          <div style={{ background: '#fee2e2', color: 'var(--danger)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Shield size={20} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Safety Center</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Access emergency triggers, contact helplines, and review active local scams.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('transport')}>
          <div style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Train size={20} />
          </div>
          <h3 style={{ fontSize: '1rem' }}>Transport Rates</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Calculate standard local fares based on distance to avoid overcharges.
          </p>
        </div>
      </div>
    </div>
  );
}
