// src/App.jsx
import React, { useState } from 'react';
import OrdinalsFetcher from './components/OrdinalsFetcher';
import RetrieveInscriptions from './components/RetrieveInscriptions';
import TradeHistory from './components/TradeHistory';
import './theme.css';
function App() {
  const [activeTab, setActiveTab] = useState('collections'); // collections, inscriptions, or trades

  return (
    <div className="container">
      <h2>Bitcoin Ordinals PoC</h2>

      <div className="toggle-container">
        <button
          className={`toggle-button ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          Collections
        </button>
        <button
          className={`toggle-button ${activeTab === 'inscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('inscriptions')}
        >
          Inscriptions
        </button>
        <button
          className={`toggle-button ${activeTab === 'trades' ? 'active' : ''}`}
          onClick={() => setActiveTab('trades')}
        >
          Trade History
        </button>
      </div>

      {activeTab === 'collections' ? (
        <OrdinalsFetcher />
      ) : activeTab === 'inscriptions' ? (
        <RetrieveInscriptions />
      ) : (
        <TradeHistory />
      )}
    </div>
  );
}

export default App;