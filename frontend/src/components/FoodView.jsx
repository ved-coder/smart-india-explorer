import React, { useState } from 'react';
import { Utensils, AlertTriangle, ShieldCheck, Heart, Info, MapPin, X } from 'lucide-react';

export default function FoodView({ regions, selectedRegionId }) {
  const [favorites, setFavorites] = useState([]);
  const [vendorModalItem, setVendorModalItem] = useState(null);
  const [customizeSpice, setCustomizeSpice] = useState('Medium');
  
  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  const toggleFavorite = (foodName) => {
    if (favorites.includes(foodName)) {
      setFavorites(favorites.filter(name => name !== foodName));
    } else {
      setFavorites([...favorites, foodName]);
    }
  };

  const getSpiceBadgeClass = (level) => {
    if (level === 'Low') return 'status-badge-secondary';
    if (level === 'Medium') return 'status-badge-accent';
    return 'status-badge-primary';
  };

  const getAllergenHindi = (allergenStr) => {
    if (!allergenStr) return '';
    const lower = allergenStr.toLowerCase();
    const list = [];
    if (lower.includes('dairy') || lower.includes('milk') || lower.includes('butter')) {
      list.push("दूध, मक्खन या मलाई (Dairy)");
    }
    if (lower.includes('gluten') || lower.includes('wheat')) {
      list.push("गेहूं या मैदा (Gluten / Wheat)");
    }
    if (lower.includes('nuts') || lower.includes('peanut')) {
      list.push("मूंगफली या काजू (Nuts)");
    }
    if (lower.includes('fish') || lower.includes('seafood')) {
      list.push("मछली (Fish)");
    }
    if (list.length === 0) return allergenStr;
    return list.join(', ');
  };

  const getSpiceRequestHindi = (level) => {
    if (level === 'Low') return 'कृपया इसे कम तीखा (कम मिर्च) बनाएं।';
    if (level === 'Medium') return 'कृपया मध्यम तीखा बनाएं।';
    return 'सामान्य तीखा (Spicy) ठीक है।';
  };

  return (
    <div className="fade-in">
      {/* Show Vendor Boarding Pass Modal */}
      {vendorModalItem && (
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
          {/* Boarding Pass Container */}
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
              onClick={() => setVendorModalItem(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: '#f3f4f6', border: 'none', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} style={{ color: '#4b5563' }} />
            </button>

            {/* Pass Header */}
            <div style={{ background: 'var(--secondary)', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>Dietary Request Ticket</div>
              <h2 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'white', fontWeight: 'bold' }}>Food Order Spec</h2>
            </div>

            {/* Pass Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1px' }}>Selected Dish</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.25rem' }}>{vendorModalItem.name}</div>
              </div>

              {/* Spice level chooser inside modal */}
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Adjust Heat</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {['Low', 'Medium', 'High'].map(lvl => (
                    <button 
                      key={lvl}
                      className={`btn ${customizeSpice === lvl ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', borderRadius: '8px' }}
                      onClick={() => setCustomizeSpice(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Local request translation */}
              <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1px' }}>Spice preference (Local Script)</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.25rem', fontFamily: 'system-ui' }}>
                  {getSpiceRequestHindi(customizeSpice)}
                </p>
              </div>

              {/* Allergens warning */}
              {vendorModalItem.allergyInfo && (
                <div style={{ background: '#fef2f2', borderLeft: '4px solid var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertTriangle size={14} />
                    <span>ALLERGEN DIRECTIVE (LOCAL SCRIPT)</span>
                  </div>
                  <p style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#991b1b', marginTop: '0.25rem' }}>
                    कृपया इसमें {getAllergenHindi(vendorModalItem.allergyInfo)} न डालें।
                  </p>
                </div>
              )}
            </div>

            {/* Pass Footer */}
            <div style={{ background: '#f9fafb', padding: '1rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              Show this pass to your cook or server
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Food Guide</h1>
          <p style={{ color: 'var(--text-sub)' }}>Local specialties with allergen data and hygiene tips.</p>
        </div>
        <div className="status-badge status-badge-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          State: {selectedRegion?.name}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Dishes */}
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Local Specialties</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedRegion?.food?.specialties?.map((dish, index) => {
              const isFav = favorites.includes(dish.name);
              return (
                <div key={index} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1.25rem', padding: '1rem' }}>
                  <div style={{ 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, var(--accent), var(--primary))', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white',
                    padding: '0.5rem'
                  }}>
                    <Utensils size={28} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{dish.name}</h3>
                        <button 
                          className="btn" 
                          style={{ padding: '0.25rem', minWidth: 'auto', background: 'transparent', boxShadow: 'none' }}
                          onClick={() => toggleFavorite(dish.name)}
                        >
                          <Heart size={16} fill={isFav ? 'var(--danger)' : 'none'} stroke={isFav ? 'var(--danger)' : 'var(--text-light)'} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '0.25rem' }}>{dish.description}</p>
                    </div>

                    <div className="flex justify-between align-center mt-2 flex-wrap gap-2">
                      <div className="flex gap-1" style={{ fontSize: '0.7rem' }}>
                        <span className={`status-badge ${getSpiceBadgeClass(dish.spicyLevel)}`}>
                          Spice: {dish.spicyLevel}
                        </span>
                        {dish.allergyInfo && (
                          <span className="status-badge" style={{ background: '#fef2f2', color: 'var(--danger)' }}>
                            Contains: {dish.allergyInfo}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        className="btn btn-accent btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}
                        onClick={() => {
                          setVendorModalItem(dish);
                          setCustomizeSpice(dish.spicyLevel === 'High' || dish.spicyLevel === 'Extremely High' ? 'High' : 'Medium');
                        }}
                      >
                        Request Ticket
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean spots */}
          <div className="glass-panel mt-3">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--secondary)' }} />
              Clean Eating Spots
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {selectedRegion?.food?.hotspots?.map((spot, i) => (
                <div key={i} style={{ background: 'white', padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{spot}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Hygiene Approved</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advisory column */}
        <div>
          <div className="glass-panel" style={{ background: 'var(--accent-light)', borderLeft: '4px solid var(--accent)' }}>
            <h2 style={{ fontSize: '1rem', color: '#b45309', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info size={16} />
              Hygiene Guidelines
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: '#78350f' }}>
              <div>
                <strong>Drinking Water:</strong> Only drink sealed bottled mineral water from reputable companies. Say no to ice in street stalls.
              </div>
              <div>
                <strong>Hot Ingredients:</strong> Eat freshly cooked, steaming hot dishes. Avoid pre-cut raw fruits exposed to the air.
              </div>
              <div>
                <strong>Locals Gauge:</strong> Dine at popular, busy street vendors. Quick turnover means fresher food ingredients.
              </div>
            </div>
            
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fef08a', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
              <strong>Regional Advice:</strong> <br/>
              {selectedRegion?.food?.safetyTips}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
