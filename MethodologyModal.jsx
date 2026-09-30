import React, { useState } from 'react';
import { X, Satellite, Layers, ShieldCheck, Database, Sliders, ExternalLink } from 'lucide-react';
import {
  SENSOR_SPECS,
  PROCESSING_PIPELINE_STEPS,
  PRIORITY_MODEL_INFO,
  DATA_SOURCES,
  MANDATORY_DISCLAIMERS,
} from '../data/methodologyData';

export function MethodologyModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [tab, setTab] = useState('pipeline');

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
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafbfc',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Satellite size={20} color="var(--primary)" />
              Data Sources, SAR Methodology & Priority Model
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Transparent scientific workflow for Problem 4.1: Rapid Flood Mapping using Sentinel-1
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#f8fafc', padding: '0 1rem' }}>
          {[
            { id: 'pipeline', label: 'Processing Pipeline' },
            { id: 'priority', label: 'Priority Scoring Model' },
            { id: 'sensors', label: 'Sentinel-1 SAR Specs' },
            { id: 'sources', label: 'Data Sources' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              style={{
                padding: '0.65rem 1rem',
                border: 'none',
                background: 'none',
                borderBottom: tab === item.id ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: tab === item.id ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {tab === 'pipeline' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>End-to-End Geospatial Architecture</h4>
                <p style={{ fontSize: '0.82rem' }}>
                  The radar workflow transforms multi-temporal Sentinel-1 Synthetic Aperture Radar (SAR) observations into validated vector inundation extents through radiometric calibration, speckle filtering, and change detection.
                </p>
              </div>

              {/* Step list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PROCESSING_PIPELINE_STEPS.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      background: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {step.step}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{step.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', paddingLeft: '2rem' }}>
                      {step.technicalDetails}
                    </p>
                    <div
                      style={{
                        marginLeft: '2rem',
                        padding: '0.35rem 0.6rem',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {step.parameters}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'priority' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>{PRIORITY_MODEL_INFO.name}</h4>
                <p style={{ fontSize: '0.82rem' }}>{PRIORITY_MODEL_INFO.description}</p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Transparent Scoring Weights
                </h5>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Asset / Vulnerability Component</th>
                        <th>Weight</th>
                        <th>Operational Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRIORITY_MODEL_INFO.weights.map((w, idx) => (
                        <tr key={idx}>
                          <td><strong>{w.component}</strong></td>
                          <td><span className="badge badge-high">{w.weight}</span></td>
                          <td>{w.rationale}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Priority Tiers & Response Protocols
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {PRIORITY_MODEL_INFO.tiers.map((tier) => (
                    <div
                      key={tier.tier}
                      style={{
                        borderLeft: `4px solid ${tier.color}`,
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span
                          style={{
                            backgroundColor: tier.badgeBg,
                            color: tier.badgeText,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {tier.tier} (Score: {tier.scoreRange})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        <strong>Criteria:</strong> {tier.criteria}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>Tactical Protocol:</strong> {tier.tacticalResponse}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'sensors' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Sentinel-1 C-SAR Instrument Specifications</h4>
                <p style={{ fontSize: '0.82rem' }}>
                  Synthetic Aperture Radar operates in active microwave frequencies (5.405 GHz), providing all-weather penetration through heavy tropical cloud cover and precipitation.
                </p>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <tbody>
                    {Object.entries(SENSOR_SPECS).map(([key, val]) => (
                      <tr key={key}>
                        <td style={{ width: '35%', fontWeight: 600, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </td>
                        <td style={{ color: 'var(--text-main)' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'sources' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Geospatial Data Sources & Licenses</h4>
                <p style={{ fontSize: '0.82rem' }}>
                  FLOOD SHIELD exclusively integrates vetted scientific and open geospatial data repositories.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DATA_SOURCES.map((src) => (
                  <div
                    key={src.name}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      background: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{src.name}</strong>
                      <span className="badge badge-success">{src.liveStatus}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Provider: {src.provider} | License: {src.license}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {src.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: '#fafbfc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Strict compliance with peer-reviewed SAR disaster mapping literature
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MethodologyModal;
