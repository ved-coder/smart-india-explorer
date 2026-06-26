import React from 'react';
import { BookOpen, AlertCircle, Calendar, Sparkles, CheckSquare } from 'lucide-react';

export default function CultureView({ regions, selectedRegionId }) {
  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const universalRules = {
    dos: [
      "Use your right hand for eating, shaking hands, and paying money.",
      "Remove your shoes before entering homes and temples.",
      "Dress modestly. Cover your shoulders and knees in holy spots.",
      "Say 'Namaste' with pressed palms to greet people politely."
    ],
    donts: [
      "Do not touch people or books with your feet.",
      "Do not hug or kiss in public places.",
      "Do not touch idols or shrines inside temples.",
      "Do not drink tap water. Drink sealed bottled water only."
    ]
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Local Customs</h1>
          <p style={{ color: 'var(--text-sub)' }}>Etiquette tips, greetings, and travel guidelines for local festivals.</p>
        </div>
        <div className="status-badge status-badge-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          State: {selectedRegion?.name}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Customs & Festivals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {selectedRegion?.culture && (
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
                State Customs
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Greeting:</span>
                  <p style={{ color: 'var(--text-sub)', marginTop: '0.15rem' }}>{selectedRegion.culture.greetings}</p>
                </div>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>How to Dress:</span>
                  <p style={{ color: 'var(--text-sub)', marginTop: '0.15rem' }}>{selectedRegion.culture.dressCode}</p>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>Local Customs:</span>
                  <p style={{ color: 'var(--text-sub)', marginTop: '0.15rem' }}>{selectedRegion.culture.customs}</p>
                </div>
              </div>
            </div>
          )}

          {/* Local Festivals Schedule */}
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Upcoming Festivals</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedRegion?.festivals?.map((fest, idx) => (
                <div key={idx} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.25rem', padding: '1rem' }}>
                  <div style={{ 
                    borderRadius: '10px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0.25rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <Calendar size={18} style={{ marginBottom: '2px' }} />
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{fest.months.split('/')[0]}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{fest.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.15rem' }}>{fest.description}</p>
                    {fest.tips && (
                      <div style={{ display: 'flex', gap: '0.2rem', background: '#f0fdf4', borderLeft: '2px solid var(--success)', padding: '0.3rem', borderRadius: '4px', fontSize: '0.75rem', color: '#166534', marginTop: '0.5rem' }}>
                        <AlertCircle size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>Tip:</strong> {fest.tips}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Do's and Don'ts */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={16} style={{ color: 'var(--primary)' }} />
              General Rules
            </h2>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--success)', letterSpacing: '0.5px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold' }}>
                <CheckSquare size={12} /> Do's
              </h4>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.25rem' }}>
                {universalRules.dos.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--danger)', letterSpacing: '0.5px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold' }}>
                <AlertCircle size={12} /> Don'ts
              </h4>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.25rem' }}>
                {universalRules.donts.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
