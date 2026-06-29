import React, { useState, useEffect } from 'react';
import { Train, Info, Calculator, ShieldCheck, Compass, AlertCircle, X, MapPin } from 'lucide-react';

// Landmark definitions for each supported region
const regionalLandmarks = {
  delhi: [
    { id: 'airport', name: 'Indira Gandhi International Airport' },
    { id: 'cp', name: 'Connaught Place (City Center)' },
    { id: 'redfort', name: 'Red Fort (Old Delhi)' },
    { id: 'indiagate', name: 'India Gate' },
    { id: 'qutub', name: 'Qutub Minar' }
  ],
  rajasthan: [
    { id: 'station', name: 'Jaipur Railway Station' },
    { id: 'hawamahal', name: 'Hawa Mahal' },
    { id: 'amerfort', name: 'Amer Fort' },
    { id: 'citypalace', name: 'City Palace' }
  ],
  maharashtra: [
    { id: 'csmt', name: 'Chhatrapati Shivaji Terminus (CSMT)' },
    { id: 'gateway', name: 'Gateway of India' },
    { id: 'marinedrive', name: 'Marine Drive' },
    { id: 'airport_mum', name: 'Mumbai Airport (T2)' }
  ],
  kerala: [
    { id: 'ernakulam', name: 'Ernakulam Junction' },
    { id: 'fortkochi', name: 'Fort Kochi' },
    { id: 'airport_koc', name: 'Kochi Airport' }
  ],
  tamilnadu: [
    { id: 'central', name: 'Chennai Central Station' },
    { id: 'marina', name: 'Marina Beach' },
    { id: 'airport_maa', name: 'Chennai Airport' }
  ],
  westbengal: [
    { id: 'howrah', name: 'Howrah Junction' },
    { id: 'victoria', name: 'Victoria Memorial' },
    { id: 'airport_ccu', name: 'Kolkata Airport' }
  ]
};

// Distance matrix lookup (sorted alphabetically by key name)
const routeDistances = {
  delhi: {
    'airport-cp': 16,
    'airport-redfort': 22,
    'airport-indiagate': 14,
    'airport-qutub': 13,
    'cp-redfort': 6,
    'cp-indiagate': 3,
    'cp-qutub': 14,
    'redfort-indiagate': 5,
    'redfort-qutub': 18,
    'indiagate-qutub': 12
  },
  rajasthan: {
    'hawamahal-station': 5,
    'amerfort-station': 13,
    'citypalace-station': 4,
    'amerfort-hawamahal': 9,
    'citypalace-hawamahal': 1,
    'amerfort-citypalace': 9
  },
  maharashtra: {
    'csmt-gateway': 2,
    'csmt-marinedrive': 3,
    'airport_mum-csmt': 22,
    'gateway-marinedrive': 4,
    'airport_mum-gateway': 24,
    'airport_mum-marinedrive': 23
  },
  kerala: {
    'ernakulam-fortkochi': 12,
    'airport_koc-ernakulam': 30,
    'airport_koc-fortkochi': 42
  },
  tamilnadu: {
    'central-marina': 4,
    'airport_maa-central': 19,
    'airport_maa-marina': 17
  },
  westbengal: {
    'howrah-victoria': 6,
    'airport_ccu-howrah': 16,
    'airport_ccu-victoria': 20
  }
};

const getRouteDistance = (regionId, src, dest) => {
  if (!src || !dest) return 0;
  if (src === dest) return 0;
  
  const key = [src, dest].sort().join('-');
  const regionRoutes = routeDistances[regionId];
  if (regionRoutes && regionRoutes[key] !== undefined) {
    return regionRoutes[key];
  }
  return 8; // Fallback average distance
};

export default function TransportView({ regions, selectedRegionId }) {
  const [distance, setDistance] = useState('5');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [activeMode, setActiveMode] = useState(null);

  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];
  const landmarks = regionalLandmarks[selectedRegionId] || [];

  // Reset route selections on region change
  useEffect(() => {
    setSource('');
    setDestination('');
    setDistance('5');
  }, [selectedRegionId]);

  const handleRouteChange = (src, dest) => {
    setSource(src);
    setDestination(dest);
    if (src && dest) {
      if (src === dest) {
        setDistance('0');
      } else {
        const dist = getRouteDistance(selectedRegionId, src, dest);
        setDistance(dist.toString());
      }
    }
  };

  // Compile list of modes: Database modes + Universal modes (Walking, Bus, App-based Taxi)
  const dbModes = selectedRegion?.transport?.modes || [];
  
  const universalModes = [
    {
      name: "Walking",
      description: "Explore on foot. Zero cost, highly eco-friendly, and great for sightseeing close-range marketplace areas.",
      baseFare: 0,
      perKm: 0,
      safetyRating: "Good (Daytime)",
      ecoFriendly: true,
      tips: "Keep an eye on traffic. Walk on footpaths where available."
    },
    {
      name: "Local City Bus",
      description: "State-run public transit buses. Very cheap but can be crowded.",
      baseFare: 10,
      perKm: 2,
      safetyRating: "Fair",
      ecoFriendly: true,
      tips: "Keep your backpack in front of you. Prepare exact change if possible."
    }
  ];

  const hasCab = dbModes.some(m => m.name.toLowerCase().includes('cab') || m.name.toLowerCase().includes('taxi'));
  const allModes = [...dbModes, ...universalModes];
  
  if (!hasCab) {
    allModes.push({
      name: "App-Based Taxi",
      description: "Private air-conditioned cabs booked via Ola or Uber. Highly comfortable and safe.",
      baseFare: 50,
      perKm: 18,
      safetyRating: "Excellent",
      ecoFriendly: false,
      tips: "Verify the driver's name and vehicle license plate in the app before boarding."
    });
  }

  const calculateFare = (mode) => {
    const distNum = parseFloat(distance) || 0;
    if (distNum <= 0) return 0;
    if (mode.name === "Walking") return 0;
    
    if (distNum <= 1) return mode.baseFare;
    return mode.baseFare + Math.round(mode.perKm * (distNum - 1));
  };

  const handleShowDriver = (mode) => {
    setActiveMode(mode);
    setShowDriverModal(true);
  };

  const getLandmarkName = (id) => {
    const lm = landmarks.find(l => l.id === id);
    return lm ? lm.name : '';
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
          backgroundColor: 'rgba(22, 38, 33, 0.4)',
          backdropFilter: 'blur(8px)',
          color: '#1e252b',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
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

              {/* Route Path (if selected) */}
              {source && destination && (
                <div style={{ 
                  textAlign: 'center', 
                  background: 'var(--primary-light)', 
                  padding: '0.65rem 1rem', 
                  borderRadius: '12px', 
                  width: '100%', 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)', 
                  fontWeight: 'bold',
                  border: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}>
                  <MapPin size={14} />
                  <span>{getLandmarkName(source)} ➔ {getLandmarkName(destination)}</span>
                </div>
              )}

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

            {/* Route Selection Criteria */}
            {landmarks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                  Select Route
                </h4>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="route-source">From (Source)</label>
                  <select
                    id="route-source"
                    className="form-control"
                    value={source}
                    onChange={(e) => handleRouteChange(e.target.value, destination)}
                  >
                    <option value="">Select Starting Point</option>
                    {landmarks.map(lm => (
                      <option key={lm.id} value={lm.id}>{lm.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="route-dest">To (Destination)</label>
                  <select
                    id="route-dest"
                    className="form-control"
                    value={destination}
                    onChange={(e) => handleRouteChange(source, e.target.value)}
                  >
                    <option value="">Select Endpoint</option>
                    {landmarks.map(lm => (
                      <option key={lm.id} value={lm.id}>{lm.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Custom Distance Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="calc-dist">Estimated Distance (km)</label>
              <input
                id="calc-dist"
                type="number"
                min="0"
                max="100"
                className="form-control"
                value={distance}
                onChange={(e) => {
                  setDistance(e.target.value);
                  setSource('');
                  setDestination('');
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                Distance updates automatically when selecting a route above.
              </span>
            </div>

            {/* Estimates List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px' }}>
                Estimates ({distance} km)
              </h4>
              
              {allModes.map((mode, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'white', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{mode.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                        {mode.name === "Walking" ? "Zero Cost" : `Base: ₹${mode.baseFare} | Km: ₹${mode.perKm}`}
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
          </div>
        </div>

        {/* Transport Modes Guide */}
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Available Vehicles & Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allModes.map((mode, index) => (
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

