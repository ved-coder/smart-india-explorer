import React, { useState } from 'react';
import { Train, Info, Calculator, ShieldCheck, Compass, AlertCircle, X } from 'lucide-react';

export default function TransportView({ regions, selectedRegionId }) {
  const [distance, setDistance] = useState('5');
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [activeMode, setActiveMode] = useState(null);

  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const calculateFare = (mode) => {
    const distNum = parseFloat(distance) || 0;
    if (distNum <= 0) return 0;
    
    if (distNum <= 1) return mode.baseFare;
    return mode.baseFare + Math.round(mode.perKm * (distNum - 1));
  };

  const handleShowDriver = (mode) => {
    setActiveMode(mode);
    setShowDriverModal(true);
  };

  return (
    <div className="fade-in">
      {/* Show to Driver Boarding Pass Modal */}
      {showDriverModal && activeMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#faf8f5',
          color: '#1e252b',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          {/* Ticket pass container */}
          <div style={{
            width: '100%',
            maxWidth: '380px',
            background: 'white',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowDriverModal(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#f3f4f6', border: 'none', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} style={{ color: '#4b5563' }} />
            </button>

            {/* Ticket Header */}
            <div style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Fare Rate Ticket</div>
              <h2 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'white', fontWeight: 'bold' }}>{activeMode.name}</h2>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #e5e7eb', width: '100%', paddingBottom: '1rem' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-sub)' }}>
                  Is this fare correct? <br/>
                  क्या यह किराया सही है?
                </p>
              </div>

              {/* Price Tag Box */}
              <div style={{ background: '#f8fafc', padding: '1.5rem 2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', minWidth: '220px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1.5px', fontWeight: 'bold' }}>ESTIMATED FARE</span>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  ₹ {calculateFare(activeMode)}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)' }}>
                  For {distance} km route. <br/>
                  ({distance} किलोमीटर की सरकारी दर के अनुसार)
                </p>
              </div>
            </div>

            {/* Ticket Footer */}
            <div style={{ background: '#f9fafb', padding: '1rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              Show this screen to your driver to confirm rate
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Transport Rates</h1>
          <p style={{ color: 'var(--text-sub)' }}>Calculate standard local pricing and compare transit choices.</p>
        </div>
        <div className="status-badge status-badge-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          State: {selectedRegion?.name}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '2rem' }}>
        {/* Calculator */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={16} style={{ color: 'var(--primary)' }} />
              Fare Calculator
            </h2>

            <div className="form-group">
              <label className="form-label" htmlFor="calc-dist">Estimated Distance (km)</label>
              <input
                id="calc-dist"
                type="number"
                min="1"
                max="100"
                className="form-control"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                Enter route distance to compare standard rates.
              </span>
            </div>

            {selectedRegion?.transport?.modes && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                  Estimates ({distance} km)
                </h4>
                
                {selectedRegion.transport.modes.map((mode, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'white', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{mode.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                          Base: ₹{mode.baseFare} | Km: ₹{mode.perKm}
                        </div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                        ₹{calculateFare(mode)}
                      </div>
                    </div>
                    
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem', fontSize: '0.75rem', width: '100%', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid #fed7aa', fontWeight: 'bold', borderRadius: '8px' }}
                      onClick={() => handleShowDriver(mode)}
                    >
                      Show Driver
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transport Modes Guide */}
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Available Vehicles</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedRegion?.transport?.modes?.map((mode, index) => (
              <div key={index} className="glass-panel" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
                    <Train size={16} style={{ color: 'var(--primary)' }} />
                    {mode.name}
                  </h3>
                  <div className="flex gap-1">
                    <span className="status-badge status-badge-secondary" style={{ fontSize: '0.65rem' }}>
                      Safety: {mode.safetyRating}
                    </span>
                    {mode.ecoFriendly && (
                      <span className="status-badge" style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.65rem' }}>
                        Eco
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.5rem' }}>
                  {mode.description}
                </p>

                {mode.tips && (
                  <div style={{ background: 'var(--primary-light)', padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', color: '#7c2d12', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                    <Info size={12} style={{ flexShrink: 0 }} />
                    <span>{mode.tips}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overcharge avoidance tips */}
          <div className="glass-panel mt-3" style={{ background: '#fffbeb', borderLeft: '4px solid var(--accent)' }}>
            <h3 style={{ fontSize: '1rem', color: '#b45309', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} />
              Booking Advice
            </h3>
            <ul style={{ fontSize: '0.75rem', color: '#78350f', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li><strong>Prepaid Counters:</strong> At transit terminals, use official prepaid counters rather than bargaining directly with drivers outside.</li>
              <li><strong>Ride-Hailing:</strong> Book via local apps (Ola or Uber) for autos and taxis to secure fixed prices and GPS logging.</li>
              <li><strong>Insist on Meter:</strong> Agree on rates or request the meter BEFORE beginning the journey.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
