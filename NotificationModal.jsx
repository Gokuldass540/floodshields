import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldAlert, Radio, Terminal } from 'lucide-react';
import { STAKEHOLDER_ROLES } from '../services/alertService';

export function NotificationModal({ alert, isOpen, onClose, onDispatchSuccess }) {
  if (!isOpen || !alert) return null;

  const [selectedRole, setSelectedRole] = useState(alert.recipientRole || 'deoc');
  const [channelNotes, setChannelNotes] = useState('Standard operational priority dispatch.');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStage, setDispatchStage] = useState('');

  const currentRole = STAKEHOLDER_ROLES.find((r) => r.id === selectedRole) || STAKEHOLDER_ROLES[0];

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchStage('Initializing secure simulated gateway...');
    await new Promise((r) => setTimeout(r, 600));

    setDispatchStage(`Formatting emergency payload for ${currentRole.name}...`);
    await new Promise((r) => setTimeout(r, 700));

    setDispatchStage(`Transmitting payload over channel: ${currentRole.channel}...`);
    await new Promise((r) => setTimeout(r, 700));

    setDispatchStage('Simulation complete. Endpoint ACK received.');
    await new Promise((r) => setTimeout(r, 500));

    setIsDispatching(false);
    onDispatchSuccess(alert.id, currentRole.name, currentRole.channel);
    onClose();
  };

  const payloadPreview = {
    incident_type: 'SAR_FLOOD_EXPANSION',
    alert_id: alert.id,
    level: alert.level,
    title: alert.title,
    location: alert.location,
    reason: alert.reason,
    recommended_action: alert.recommendedAction,
    timestamp: new Date().toISOString(),
    channel_simulation: currentRole.channel,
    operational_disclaimer: 'AUTHORIZED ALERT SIMULATION — GROUND VERIFICATION REQUIRED BEFORE RESOURCE COMMITMENT',
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
          maxWidth: '640px',
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
            <Radio size={18} color="var(--primary)" />
            <strong style={{ fontSize: '0.95rem' }}>Authorized Alert Simulation Dispatch</strong>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        <div style={{ padding: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
          <div className="disclaimer-banner">
            <ShieldAlert size={16} />
            <span>
              <strong>Simulated Operational Routing:</strong> Dispatches are recorded inside the decision-support log and transmitted to internal simulation endpoints only.
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Target Emergency Alert
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {alert.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.location}</div>
          </div>

          <div className="form-group">
            <label className="form-label">Designated Stakeholder Endpoint</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isDispatching}
            >
              {STAKEHOLDER_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.channel})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Transmission Metadata & Operational Instructions</label>
            <input
              type="text"
              className="form-input"
              value={channelNotes}
              onChange={(e) => setChannelNotes(e.target.value)}
              disabled={isDispatching}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Terminal size={14} />
              JSON Payload Preview
            </label>
            <pre
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                overflowX: 'auto',
                fontFamily: 'monospace',
                maxHeight: '160px',
              }}
            >
              {JSON.stringify(payloadPreview, null, 2)}
            </pre>
          </div>

          {isDispatching && (
            <div
              style={{
                padding: '0.65rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: '#1e40af',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div className="status-dot pulse" style={{ background: '#2563eb' }} />
              <span>{dispatchStage}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isDispatching}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDispatch}
              disabled={isDispatching}
            >
              <Send size={14} />
              {isDispatching ? 'Transmitting...' : 'Dispatch Authorized Alert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
