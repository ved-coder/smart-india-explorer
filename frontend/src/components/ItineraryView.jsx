import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, ShieldAlert, Navigation, Sparkles, Coffee, DollarSign, Clock, Check } from 'lucide-react';

export default function ItineraryView({ regions, savedItineraries, onSaveItinerary, onDeleteItinerary, currentUser }) {
  const [regionId, setRegionId] = useState(regions[0]?.id || '');
  const [duration, setDuration] = useState('3');
  const [budget, setBudget] = useState('Mid-range');
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const interestsMap = [
    { value: 'History', label: 'History' },
    { value: 'Culture', label: 'Traditions' },
    { value: 'Culinary', label: 'Local Food' },
    { value: 'Spiritual', label: 'Temples' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Nature', label: 'Nature' }
  ];

  useEffect(() => {
    if (regions.length > 0 && !regionId) {
      setRegionId(regions[0].id);
    }
  }, [regions]);

  const handleInterestChange = (interestValue) => {
    if (selectedInterests.includes(interestValue)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestValue));
    } else {
      setSelectedInterests([...selectedInterests, interestValue]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8081/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regionId,
          duration: parseInt(duration, 10),
          budget,
          interests: selectedInterests,
          userId: currentUser?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate.');
      }

      const data = await response.json();
      setActiveItinerary(data);
      onSaveItinerary(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Trip Planner</h1>
          <p style={{ color: 'var(--text-sub)' }}>Create custom day plans based on your profile.</p>
        </div>
        {savedItineraries.length > 0 && (
          <select 
            className="form-control" 
            style={{ width: '220px' }}
            onChange={(e) => {
              const selected = savedItineraries.find(it => it.id === e.target.value);
              if (selected) setActiveItinerary(selected);
            }}
            value={activeItinerary?.id || ''}
          >
            <option value="" disabled>Saved Plans</option>
            {savedItineraries.map(it => (
              <option key={it.id} value={it.id}>{it.title}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Planning Form */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              Plan Settings
            </h2>
            
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label className="form-label" htmlFor="w-region">Destination</label>
                <select
                  id="w-region"
                  className="form-control"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  required
                >
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="w-duration">Stay Length</label>
                <select
                  id="w-duration"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="3">3 Days (Highlights)</option>
                  <option value="7">7 Days (Standard)</option>
                  <option value="14">14 Days (Leisure)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Budget Tier</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[
                    { val: 'Backpacker', show: 'Cheap' },
                    { val: 'Mid-range', show: 'Medium' },
                    { val: 'Luxury', show: 'Luxury' }
                  ].map(tier => (
                    <button
                      key={tier.val}
                      type="button"
                      className={`btn ${budget === tier.val ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.5rem 0.25rem', fontSize: '0.8rem' }}
                      onClick={() => setBudget(tier.val)}
                    >
                      {tier.show}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Interests</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {interestsMap.map(interest => {
                    const isSelected = selectedInterests.includes(interest.value);
                    return (
                      <button
                        key={interest.value}
                        type="button"
                        className={`btn ${isSelected ? 'btn-accent' : 'btn-secondary'}`}
                        style={{ padding: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}
                        onClick={() => handleInterestChange(interest.value)}
                      >
                        <span style={{ fontSize: '0.75rem' }}>{interest.label}</span>
                        {isSelected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isGenerating}
                style={{ marginTop: '0.75rem' }}
              >
                {isGenerating ? 'Planning Sights...' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>

        {/* Itinerary Display */}
        <div>
          {activeItinerary ? (
            <div className="fade-in">
              <div className="glass-panel mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>{activeItinerary.title}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className="status-badge status-badge-primary">Budget: {activeItinerary.budget}</span>
                    <span className="status-badge status-badge-secondary">Stay: {activeItinerary.duration} Days</span>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => {
                    onDeleteItinerary(activeItinerary.id);
                    setActiveItinerary(null);
                  }}
                  title="Delete Plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Day-by-Day View */}
              {activeItinerary.days.map((day) => (
                <div key={day.dayNumber} className="glass-panel mb-2" style={{ borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignContent: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                    <Calendar className="color-primary" size={18} style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                      Day {day.dayNumber}: {day.theme}
                    </h3>
                  </div>

                  {/* Hourly Sights */}
                  <div className="timeline">
                    {day.activities.map((act, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{act.activity}</h4>
                            <span className="status-badge status-badge-accent" style={{ fontSize: '0.65rem' }}>
                              Cost: {act.costEstimate.split('(')[0]}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.4rem' }}>
                            <Clock size={10} />
                            Time: {act.time}
                          </span>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '0.4rem' }}>{act.description}</p>
                          {act.tip && (
                            <div style={{ background: '#fdf6e2', borderLeft: '2px solid var(--accent)', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', color: '#b45309', display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
                              <Coffee size={12} style={{ flexShrink: 0 }} />
                              <span>{act.tip}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Daily Food and Safety Overlays */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <Coffee size={16} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 'bold' }}>Local Dishes</h4>
                        <p style={{ fontSize: '0.75rem' }}>{day.foodRecommendation}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <ShieldAlert size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 'bold' }}>Safety Tip</h4>
                        <p style={{ fontSize: '0.75rem' }}>{day.safetyTip}</p>
                      </div>
                    </div>
                  </div>

                  {day.transportSuggestion && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', background: 'var(--secondary-light)', padding: '0.4rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--secondary-hover)' }}>
                      <Navigation size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Transit:</strong> {day.transportSuggestion}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '360px', textAlign: 'center', color: 'var(--text-light)' }}>
              <Calendar size={48} style={{ strokeWidth: 1, marginBottom: '1rem', color: 'var(--border-color)' }} />
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>No Plan Loaded</h3>
              <p style={{ maxWidth: '300px', marginTop: '0.25rem', fontSize: '0.8rem' }}>
                Fill out settings on the left to create a new trip plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
