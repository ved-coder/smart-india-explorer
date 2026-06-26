import React, { useState, useEffect } from 'react';
import { Home, Calendar, Compass, Languages, Utensils, Shield, Sparkles, Train, Menu, X, LogOut } from 'lucide-react';
import HomeView from './components/HomeView';
import ItineraryView from './components/ItineraryView';
import ARNavigationView from './components/ARNavigationView';
import TranslationView from './components/TranslationView';
import FoodView from './components/FoodView';
import SafetyView from './components/SafetyView';
import CultureView from './components/CultureView';
import TransportView from './components/TransportView';
import AuthView from './components/AuthView';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('travel_buddy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('delhi');
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);

  // Fetch Regions from backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setBackendOffline(false);

        const regionsRes = await fetch('http://localhost:8081/api/regions');
        if (!regionsRes.ok) throw new Error('Failed to fetch regions');
        const regionsData = await regionsRes.json();
        setRegions(regionsData);
        if (regionsData.length > 0) {
          setSelectedRegionId(regionsData[0].id);
        }
      } catch (err) {
        console.error('Error connecting to backend API:', err);
        setBackendOffline(true);
        // Fallback mock regions data if backend is offline
        const fallbackRegions = [
          { id: 'delhi', name: 'Delhi', capital: 'New Delhi', languages: ['Hindi', 'English'], description: 'National Capital Region.' },
          { id: 'rajasthan', name: 'Rajasthan', capital: 'Jaipur', languages: ['Hindi', 'Rajasthani'], description: 'Land of Kings and Forts.' }
        ];
        setRegions(fallbackRegions);
        setSelectedRegionId('delhi');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Fetch itineraries when user changes or reconnects
  useEffect(() => {
    const fetchItineraries = async () => {
      if (!currentUser) {
        setSavedItineraries([]);
        return;
      }
      try {
        const itinerariesRes = await fetch(`http://localhost:8081/api/itineraries?userId=${currentUser.id}`);
        if (itinerariesRes.ok) {
          const itinerariesData = await itinerariesRes.json();
          setSavedItineraries(itinerariesData);
        }
      } catch (err) {
        console.error('Error fetching saved itineraries:', err);
      }
    };

    if (!backendOffline) {
      fetchItineraries();
    }
  }, [currentUser, backendOffline]);

  // Fetch detailed info of a single region when user deep dives
  const fetchSingleRegion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/regions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch region details');
      const data = await response.json();
      
      // Update regions list in state with fully loaded info
      setRegions(prev => prev.map(r => r.id === id ? data : r));
    } catch (err) {
      console.error('Error fetching region details:', err);
    }
  };

  const handleSelectRegion = (id) => {
    setSelectedRegionId(id);
    // Fetch full details (sights, food, safety etc) if not already loaded in local state
    const current = regions.find(r => r.id === id);
    if (current && !current.food) {
      fetchSingleRegion(id);
    }
  };

  // Trigger detailed fetch on startup for the default selected state
  useEffect(() => {
    if (selectedRegionId && regions.length > 0) {
      const current = regions.find(r => r.id === selectedRegionId);
      if (current && !current.food && !backendOffline) {
        fetchSingleRegion(selectedRegionId);
      }
    }
  }, [selectedRegionId, regions.length, backendOffline]);

  const handleSaveItinerary = (itinerary) => {
    setSavedItineraries(prev => {
      // Avoid duplicate display in UI state
      if (prev.some(item => item.id === itinerary.id)) return prev;
      return [...prev, itinerary];
    });
  };

  const handleDeleteItinerary = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/itineraries/${id}`, {
        method: 'DELETE',
      });
      setSavedItineraries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete itinerary:', err);
    }
  };

  // Render AuthView if not logged in
  if (!currentUser) {
    return <AuthView onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  // Navigation Links Definition
  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'itinerary', label: 'Trip Planner', icon: Calendar },
    { id: 'navigation', label: 'Camera Map', icon: Compass },
    { id: 'translation', label: 'Translator', icon: Languages },
    { id: 'food', label: 'Food Guide', icon: Utensils },
    { id: 'safety', label: 'Safety Center', icon: Shield },
    { id: 'culture', label: 'Local Customs', icon: Sparkles },
    { id: 'transport', label: 'Transport Rates', icon: Train },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Render active view
  const renderView = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, height: '400px' }}>
          <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-sub)' }}>Loading Travel Buddy Ecosystem...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={handleSelectRegion}
            setActiveTab={setActiveTab}
          />
        );
      case 'itinerary':
        return (
          <ItineraryView
            regions={regions}
            savedItineraries={savedItineraries}
            onSaveItinerary={handleSaveItinerary}
            onDeleteItinerary={handleDeleteItinerary}
            currentUser={currentUser}
          />
        );
      case 'navigation':
        return <ARNavigationView selectedRegionId={selectedRegionId} />;
      case 'translation':
        return <TranslationView />;
      case 'food':
        return <FoodView regions={regions} selectedRegionId={selectedRegionId} />;
      case 'safety':
        return <SafetyView regions={regions} selectedRegionId={selectedRegionId} />;
      case 'culture':
        return <CultureView regions={regions} selectedRegionId={selectedRegionId} />;
      case 'transport':
        return <TransportView regions={regions} selectedRegionId={selectedRegionId} />;
      default:
        return <HomeView regions={regions} selectedRegionId={selectedRegionId} onSelectRegion={handleSelectRegion} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Offline Status Warning Bar */}
      {backendOffline && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', background: 'var(--danger)', color: 'white', zIndex: 1000, padding: '0.4rem', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️ Backend Offline. Scenarios are running in simulated Local-Only mode.</span>
          <button className="btn btn-secondary" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }} onClick={() => window.location.reload()}>
            Reconnect
          </button>
        </div>
      )}

      {/* Mobile Header Nav Trigger */}
      <div style={{
        position: 'fixed',
        top: backendOffline ? '30px' : '0',
        left: 0,
        width: '100%',
        height: '60px',
        background: 'var(--bg-sidebar)',
        display: 'none',
        alignItems: 'center',
        padding: '0 1rem',
        color: 'white',
        zIndex: 90,
        boxShadow: 'var(--shadow-sm)'
      }} className="mobile-header">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span style={{ marginLeft: '1rem', fontWeight: '700', fontSize: '1.1rem' }}>Smart India Explorer</span>
      </div>

      {/* Styles for mobile responsive overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .mobile-header { display: flex !important; }
          .main-content { margin-top: ${backendOffline ? '90px' : '60px'} !important; }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ top: backendOffline ? '30px' : '0', height: backendOffline ? 'calc(100vh - 30px)' : '100vh' }}>
        <div className="sidebar-logo">
          <Compass size={24} style={{ color: 'var(--accent)' }} />
          <span className="sidebar-logo-text">Smart India Explorer</span>
        </div>

        {/* Logged in User Profile Info */}
        {currentUser && (
          <div style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              color: 'white',
              flexShrink: 0
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{currentUser.username}
              </span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <a
                key={link.id}
                className={`sidebar-link ${activeTab === link.id ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                <LinkIcon size={20} />
                <span>{link.label}</span>
              </a>
            );
          })}

          {currentUser && (
            <a
              className="sidebar-link"
              onClick={() => {
                localStorage.removeItem('travel_buddy_user');
                setCurrentUser(null);
                setActiveTab('home');
              }}
              style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}
            >
              <LogOut size={20} style={{ color: 'var(--danger)' }} />
              <span style={{ color: 'var(--danger)' }}>Log Out</span>
            </a>
          )}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
          Smart India Explorer v1.0.0<br/>
          Indian Tourism Companion
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content" style={{ marginTop: backendOffline ? '30px' : '0' }}>
        {renderView()}
      </main>
    </div>
  );
}

