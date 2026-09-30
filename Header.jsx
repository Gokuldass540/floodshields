import React, { useState } from 'react';
import { Shield, Radio, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import floodAnalysisService from '../services/floodAnalysisService';

export function Header({ currentRun, isDemoMode, setIsDemoMode, onGeeKeyModalOpen }) {
  return (
    <header className="top-header">
      <div className="header-brand">
        {/* Minimal professional shield with water contour */}
        <div style={{ display: 'flex', alignItems: 'center', color: '#1e40af' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M8 12c1.5-1 3.5-1 5 0s3.5 1 5 0" stroke="#0284c7" strokeWidth="2.2" />
            <path d="M7 15c1.5-1 3.5-1 5 0s3.5 1 4 0" stroke="#0284c7" strokeWidth="1.8" />
          </svg>
        </div>
        <div>
          <span className="header-brand-title">FLOOD SHIELD</span>
        </div>
        <span className="header-brand-subtitle">
          Rapid Flood Intelligence & Emergency Response Platform
        </span>
      </div>

      <div className="header-meta">
        {/* Current Active Region */}
        <div className="meta-chip">
          <span style={{ color: 'var(--text-muted)' }}>Region:</span>
          <strong style={{ color: 'var(--text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentRun ? currentRun.regionName : 'Assam Brahmaputra Basin'}
          </strong>
        </div>

        {/* Operational System Status */}
        <div className="meta-chip">
          <span className="status-dot pulse" />
          <span style={{ fontWeight: 600, color: 'var(--success-dark)' }}>System: Operational</span>
        </div>

        {/* Mode Toggle: DEMO SCENARIO vs LIVE ANALYSIS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`btn btn-sm ${isDemoMode ? 'badge-demo' : 'btn-secondary'}`}
            style={{ border: 'none', padding: '0.25rem 0.55rem', fontSize: '0.72rem', cursor: 'pointer' }}
            onClick={() => {
              setIsDemoMode(true);
              floodAnalysisService.setMode('DEMO');
            }}
            title="Demonstration dataset with vetted Sentinel-1 SAR observations"
          >
            DEMO SCENARIO
          </button>
          <button
            type="button"
            className={`btn btn-sm ${!isDemoMode ? 'badge-live' : 'btn-secondary'}`}
            style={{ border: 'none', padding: '0.25rem 0.55rem', fontSize: '0.72rem', cursor: 'pointer' }}
            onClick={() => {
              setIsDemoMode(false);
              floodAnalysisService.setMode('LIVE');
            }}
            title="Live Google Earth Engine SAR pipeline connection"
          >
            LIVE SATELLITE (GEE)
          </button>
        </div>

        {/* GEE Credential Trigger */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onGeeKeyModalOpen}
          title="Google Earth Engine Credentials & API Key"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
        >
          <Key size={13} />
          GEE Config
        </button>
      </div>
    </header>
  );
}

export default Header;
