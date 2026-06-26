import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Phone, LifeBuoy, X, User, PhoneCall, PhoneOff } from 'lucide-react';

export default function SafetyView({ regions, selectedRegionId }) {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [showFakeCallOverlay, setShowFakeCallOverlay] = useState(false);
  const [fakeCallTimer, setFakeCallTimer] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  useEffect(() => {
    let interval = null;
    if (sosActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (sosActive && countdown === 0) {
      setSosTriggered(true);
      setSosActive(false);
    }
    return () => clearInterval(interval);
  }, [sosActive, countdown]);

  useEffect(() => {
    let interval = null;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const handleSosStart = () => {
    setCountdown(5);
    setSosActive(true);
    setSosTriggered(false);
  };

  const handleSosCancel = () => {
    setSosActive(false);
    setCountdown(5);
  };

  const triggerFakeCall = () => {
    alert("Phone will ring in 5 seconds. Use it to excuse yourself from persistent sellers.");
    const timer = setTimeout(() => {
      setShowFakeCallOverlay(true);
      setCallActive(false);
    }, 5000);
    setFakeCallTimer(timer);
  };

  const cancelFakeCallSchedule = () => {
    if (fakeCallTimer) {
      clearTimeout(fakeCallTimer);
      setFakeCallTimer(null);
      alert("Fake call cancelled.");
    }
  };

  const acceptCall = () => {
    setCallActive(true);
  };

  const endCall = () => {
    setCallActive(false);
    setShowFakeCallOverlay(false);
  };

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fade-in">
      <h1>Safety Center</h1>
      <p style={{ color: 'var(--text-sub)', marginBottom: '2rem' }}>
        Emergency alerts, helplines, and warning logs for common scams.
      </p>

      {/* Fake Call Overlay */}
      {showFakeCallOverlay && (
        <div className="fake-call-overlay">
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '50%', display: 'inline-flex', marginBottom: '1.5rem' }}>
              <User size={64} style={{ color: '#cbd5e1' }} />
            </div>
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Hotel Manager</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', marginTop: '0.5rem' }}>
              {callActive ? `Calling... ${formatCallTime(callDuration)}` : "Incoming Call..."}
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', justifyContent: 'space-around', marginBottom: '4rem' }}>
            {!callActive ? (
              <>
                <button 
                  onClick={acceptCall}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', background: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <PhoneCall size={28} />
                </button>
                <button 
                  onClick={endCall}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', background: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <PhoneOff size={28} />
                </button>
              </>
            ) : (
              <button 
                onClick={endCall}
                style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', background: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <PhoneOff size={28} />
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* SOS Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel text-center">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Shield size={18} style={{ color: 'var(--danger)' }} />
              SOS Emergency Button
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '1.25rem' }}>
              Tap to share your location logs and send alert messages to emergency contacts.
            </p>

            <div className="sos-button-container">
              {!sosActive && !sosTriggered && (
                <button className="sos-button" onClick={handleSosStart}>SOS</button>
              )}

              {sosActive && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{countdown}</div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Alerting contacts in {countdown}s...</p>
                  <button className="btn btn-secondary" onClick={handleSosCancel}>Cancel Alert</button>
                </div>
              )}

              {sosTriggered && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div className="status-badge status-badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    🚨 SOS Alert Dispatched
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', maxWidth: '280px', marginTop: '0.25rem' }}>
                    GPS coordinates logged and sent to local emergency networks.
                  </p>
                  <button className="btn btn-secondary" onClick={() => setSosTriggered(false)}>Reset SOS</button>
                </div>
              )}
            </div>
          </div>

          {/* Escape Helper */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LifeBuoy size={16} style={{ color: 'var(--secondary)' }} />
              Fake Call Escaper
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              Schedule a simulated phone call to excuse yourself from persistent sellers or guides.
            </p>

            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={triggerFakeCall}>
                Call in 5s
              </button>
              {fakeCallTimer && (
                <button className="btn btn-secondary" onClick={cancelFakeCallSchedule}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scam warnings and helplines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* State specific Scam Radar */}
          <div className="glass-panel" style={{ background: '#fff5f5', borderLeft: '4px solid var(--danger)' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#991b1b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
              Scam Radar ({selectedRegion?.name})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedRegion?.safety?.scams?.map((scam, i) => (
                <div key={i} style={{ borderBottom: i < selectedRegion.safety.scams.length - 1 ? '1px solid #fecaca' : 'none', paddingBottom: '0.75rem' }}>
                  <h4 style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 'bold' }}>⚠️ {scam.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#7f1d1d', marginTop: '0.25rem' }}>{scam.description}</p>
                  <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.4rem', padding: '0.3rem', background: '#f0fdf4', borderRadius: '4px', borderLeft: '2px solid #22c55e' }}>
                    <strong>Avoidance:</strong> {scam.avoidance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helplines */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={16} style={{ color: 'var(--success)' }} />
              Emergency Helplines
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignContent: 'center' }}>
                <div style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.15rem', width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  112
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Police/Medical</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>National hotline</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignContent: 'center' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.15rem', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1363
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Tourist Help</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Multilingual center</div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                Tourist Police Helpline:
              </span>
              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                📞 {selectedRegion?.safety?.emergencyContacts?.touristPolice || "+91-11-23378890"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
