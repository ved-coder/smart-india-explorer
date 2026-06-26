import React, { useState, useEffect, useRef } from 'react';
import { Camera, Compass, Navigation, AlertTriangle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function ARNavigationView() {
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [simulationSpot, setSimulationSpot] = useState('delhi_fort');
  const [bearing, setBearing] = useState(145);
  const [compassDir, setCompassDir] = useState('SE');
  
  const videoRef = useRef(null);

  // Spots Database for Simulation
  const spots = {
    delhi_fort: {
      name: "Old Delhi Bazaar",
      backgroundImage: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=80&w=1200&auto=format&fit=crop",
      markers: [
        { id: 1, name: "Red Fort", distance: "5 min walk", type: "Monument", rating: "4.6 ★", top: 40, left: 35, color: "var(--accent)" },
        { id: 2, name: "Spice Market", distance: "1 min walk", type: "Bazaar", rating: "4.2 ★", top: 55, left: 75, color: "var(--primary)" },
        { id: 3, name: "WARNING: Fake Office", distance: "Very close", type: "Avoid Touts", rating: "Scam Zone", top: 65, left: 15, isScam: true, color: "var(--danger)" }
      ]
    },
    agra_taj: {
      name: "Taj Mahal Complex",
      backgroundImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop",
      markers: [
        { id: 1, name: "Taj Mahal", distance: "4 min walk", type: "Monument", rating: "4.9 ★", top: 35, left: 50, color: "var(--accent)" },
        { id: 2, name: "Official Photos", distance: "1 min walk", type: "Photos Queue", rating: "4.5 ★", top: 60, left: 20, color: "var(--secondary)" },
        { id: 3, name: "Police Assistance", distance: "2 min walk", type: "Help Booth", rating: "Secure Area", top: 45, left: 80, isSecure: true, color: "var(--accent)" }
      ]
    },
    jaipur_hawa: {
      name: "Hawa Mahal Area",
      backgroundImage: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1200&auto=format&fit=crop",
      markers: [
        { id: 1, name: "Hawa Mahal", distance: "2 min walk", type: "Monument", rating: "4.7 ★", top: 30, left: 45, color: "var(--accent)" },
        { id: 2, name: "Puppet Craft Shop", distance: "Close", type: "Bargain Store", rating: "4.0 ★", top: 58, left: 78, color: "var(--primary)" },
        { id: 3, name: "WARNING: Fake Gems", distance: "Close", type: "Avoid Touts", rating: "Scam Zone", top: 70, left: 18, isScam: true, color: "var(--danger)" }
      ]
    }
  };

  const activeSpot = spots[simulationSpot] || spots.delhi_fort;

  const toggleCamera = async () => {
    if (useCamera) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      setCameraStream(null);
      setUseCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setCameraStream(stream);
        setUseCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Camera disabled. Running in simulation mode instead.");
        setUseCamera(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBearing(prev => {
        const diff = Math.floor(Math.random() * 5) - 2;
        let newBearing = (prev + diff + 360) % 360;
        
        if (newBearing >= 337.5 || newBearing < 22.5) setCompassDir('N');
        else if (newBearing >= 22.5 && newBearing < 67.5) setCompassDir('NE');
        else if (newBearing >= 67.5 && newBearing < 112.5) setCompassDir('E');
        else if (newBearing >= 112.5 && newBearing < 157.5) setCompassDir('SE');
        else if (newBearing >= 157.5 && newBearing < 202.5) setCompassDir('S');
        else if (newBearing >= 202.5 && newBearing < 247.5) setCompassDir('SW');
        else if (newBearing >= 247.5 && newBearing < 292.5) setCompassDir('W');
        else setCompassDir('NW');
        
        return newBearing;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1>Camera Map</h1>
          <p style={{ color: 'var(--text-sub)' }}>
            Point your camera to display navigation directions and safety tags over street views.
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="form-control" 
            style={{ width: '220px' }}
            value={simulationSpot}
            onChange={(e) => setSimulationSpot(e.target.value)}
          >
            <option value="delhi_fort">Old Delhi Bazaar</option>
            <option value="agra_taj">Taj Mahal Front</option>
            <option value="jaipur_hawa">Hawa Mahal Area</option>
          </select>

          <button 
            className={`btn ${useCamera ? 'btn-accent' : 'btn-primary'}`}
            onClick={toggleCamera}
          >
            {useCamera ? <EyeOff size={16} /> : <Camera size={16} />}
            {useCamera ? 'Camera OFF' : 'Camera ON'}
          </button>
        </div>
      </div>

      {/* AR Viewfinder Screen */}
      <div className="ar-viewfinder">
        {useCamera ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className="ar-camera-feed"
          />
        ) : (
          <div 
            className="ar-fallback-feed"
            style={{ backgroundImage: `url(${activeSpot.backgroundImage})` }}
          />
        )}

        {/* HUD Elements Layer */}
        <div className="ar-overlay">
          {/* Compass Widget */}
          <div className="ar-compass-hud">
            <Compass size={14} style={{ marginRight: '6px', verticalAlign: 'middle', color: 'var(--accent)' }} />
            <span>Heading: {compassDir}</span>
          </div>

          {/* Floaters Overlays */}
          {activeSpot.markers.map(marker => (
            <div 
              key={marker.id} 
              className="ar-marker fade-in"
              style={{ 
                top: `${marker.top}%`, 
                left: `${marker.left}%`,
                borderLeftColor: marker.isScam ? 'var(--danger)' : (marker.isSecure ? 'var(--success)' : 'var(--accent)')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{marker.name}</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '2px' }}>{marker.type}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '6px', fontSize: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '4px' }}>
                {marker.isScam ? (
                  <>
                    <AlertTriangle size={12} style={{ color: 'var(--danger)' }} />
                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{marker.distance}</span>
                  </>
                ) : marker.isSecure ? (
                  <>
                    <ShieldCheck size={12} style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{marker.distance}</span>
                  </>
                ) : (
                  <>
                    <Navigation size={10} style={{ color: 'var(--secondary)', transform: 'rotate(45deg)' }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{marker.distance}</span>
                  </>
                )}
              </div>
            </div>
          ))}

          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            [GPS Scanning Active]
          </div>
        </div>
      </div>

      {/* Simplified Help Panel */}
      <div className="grid-2 mt-2">
        <div className="glass-panel">
          <h3>HUD Markers</h3>
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
            <li><strong>Gold Tags:</strong> Sights, markets, and tourist areas.</li>
            <li><strong>Red Alert Tags:</strong> Active tourist scam warning zones.</li>
            <li><strong>Green Tags:</strong> Police assistance hubs and help desks.</li>
          </ul>
        </div>
        <div className="glass-panel">
          <h3>Operation</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginTop: '0.5rem' }}>
            Click <strong>"Camera ON"</strong> to overlay points of interest relative to your current path, or browse mock scenarios in the selection menu.
          </p>
        </div>
      </div>
    </div>
  );
}
