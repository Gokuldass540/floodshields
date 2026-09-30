import React, { useState } from 'react';
import { X, Key, ShieldCheck, Info } from 'lucide-react';
import floodAnalysisService from '../services/floodAnalysisService';

export function GeeKeyModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [keyInput, setKeyInput] = useState(floodAnalysisService.getGeeApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    floodAnalysisService.setGeeApiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSave(keyInput.trim());
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafbfc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.95rem' }}>Google Earth Engine (GEE) Settings</strong>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '1.25rem' }}>
          <div className="disclaimer-banner" style={{ marginBottom: '1rem' }}>
            <Info size={16} />
            <span>
              For live queries, provide a valid GEE Service Account Key or OAuth access token. Otherwise, FLOOD SHIELD seamlessly uses the preconfigured <strong>Demo Scenario</strong> with authentic Sentinel-1 SAR observations.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">GEE Service Account Private Key / API Token</label>
            <input
              type="password"
              className="form-input"
              placeholder="Paste Earth Engine token or service JSON..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Stored locally in browser session storage only. Never transmitted to third-party trackers.
            </span>
          </div>

          {savedSuccess && (
            <div style={{ padding: '0.5rem', background: 'var(--success-light)', color: 'var(--success-dark)', borderRadius: '4px', fontSize: '0.78rem', marginBottom: '1rem' }}>
              Configuration saved successfully.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GeeKeyModal;
