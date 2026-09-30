import React from 'react';
import {
  LayoutDashboard,
  Satellite,
  Layers,
  BellRing,
  FileSpreadsheet,
  Film,
  ShieldAlert,
  CloudRain,
  FileText,
  Info,
  Database,
  ExternalLink,
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, openAlertsCount = 0, onOpenMethodology }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analysis', label: 'Flood Analysis', icon: Satellite },
    { id: 'impact', label: 'Impact Assessment', icon: Layers },
    { id: 'alerts', label: 'Alert Center', icon: BellRing, badge: openAlertsCount },
    { id: 'brief', label: 'Situation Brief', icon: FileSpreadsheet },
    { id: 'visualization', label: 'Situation Visualization', icon: Film },
    { id: 'preparedness', label: 'Preparedness Watch', icon: ShieldAlert },
    { id: 'context', label: 'Rainfall & Terrain', icon: CloudRain },
    { id: 'reports', label: 'Incident Reports', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div style={{ padding: '1rem 1.25rem 0.5rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
            Command Modules
          </span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          onClick={onOpenMethodology}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.25rem 0',
            marginBottom: '0.5rem',
          }}
        >
          <Database size={14} />
          <span>Data Sources & Methodology</span>
        </button>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', lineHeight: '1.4' }}>
          <strong>Domain 4: Disaster Risk Analysis</strong>
          <div>Problem 4.1: Rapid Flood SAR Mapping</div>
          <div style={{ marginTop: '0.25rem', color: '#94a3b8' }}>Hackathon Prototype v1.0</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
