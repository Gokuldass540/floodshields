import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export function MapView({
  center = [26.58, 93.18],
  zoom = 11,
  bounds = null,
  layers = null,
  height = '520px',
  activeStage = null, // for situation visualization stepping
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({
    tileLayer: null,
    satelliteLayer: null,
    baselineWater: null,
    floodExtent: null,
    bufferZone: null,
    roads: null,
    facilities: null,
  });

  const [useSatelliteBasemap, setUseSatelliteBasemap] = useState(false);
  const [showFloodExtent, setShowFloodExtent] = useState(true);
  const [showBaselineWater, setShowBaselineWater] = useState(true);
  const [showBufferZone, setShowBufferZone] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showSettlements, setShowSettlements] = useState(true);

  // Initialize map instance once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // CartoDB Positron Light Tiles
    const positronTile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
        subdomains: 'abcd',
      }
    );

    // Esri World Imagery Satellite Tiles
    const satelliteTile = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }
    );

    positronTile.addTo(map);

    layerGroupsRef.current.tileLayer = positronTile;
    layerGroupsRef.current.satelliteLayer = satelliteTile;
    layerGroupsRef.current.baselineWater = L.layerGroup().addTo(map);
    layerGroupsRef.current.floodExtent = L.layerGroup().addTo(map);
    layerGroupsRef.current.bufferZone = L.layerGroup().addTo(map);
    layerGroupsRef.current.roads = L.layerGroup().addTo(map);
    layerGroupsRef.current.facilities = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
      if (bounds) {
        map.fitBounds(bounds, { padding: [25, 25] });
      }
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center or bounds when region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (bounds) {
      map.fitBounds(bounds, { padding: [25, 25] });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds]);

  // Basemap switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const { tileLayer, satelliteLayer } = layerGroupsRef.current;

    if (useSatelliteBasemap) {
      if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
      if (!map.hasLayer(satelliteLayer)) map.addLayer(satelliteLayer);
    } else {
      if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
      if (!map.hasLayer(tileLayer)) map.addLayer(tileLayer);
    }
  }, [useSatelliteBasemap]);

  // Render Geospatial Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layers) return;

    const {
      baselineWater: baselineWaterGroup,
      floodExtent: floodExtentGroup,
      bufferZone: bufferZoneGroup,
      roads: roadsGroup,
      facilities: facilitiesGroup,
    } = layerGroupsRef.current;

    // Clear previous vector layers
    baselineWaterGroup.clearLayers();
    floodExtentGroup.clearLayers();
    bufferZoneGroup.clearLayers();
    roadsGroup.clearLayers();
    facilitiesGroup.clearLayers();

    // 1. Baseline Permanent Water
    if (showBaselineWater && layers.baselineWater) {
      L.geoJSON(layers.baselineWater, {
        style: {
          color: '#0369a1',
          weight: 1.5,
          fillColor: '#0284c7',
          fillOpacity: 0.6,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif;">
              <strong style="color: #0369a1;">Permanent Water Baseline</strong><br/>
              ${feature.properties?.name || 'River Channel'}<br/>
              <span style="color: #64748b; font-size: 11px;">JRC Global Surface Water / Pre-Flood SAR</span>
            </div>
          `);
        },
      }).addTo(baselineWaterGroup);
    }

    // 2. Detected Flood Extent (SAR Expansion)
    // If activeStage is provided (Situation Visualization mode), check visibility
    const isFloodVisible = showFloodExtent && (activeStage === null || activeStage >= 2);
    if (isFloodVisible && layers.floodExtent) {
      L.geoJSON(layers.floodExtent, {
        style: {
          color: '#b91c1c',
          weight: 2,
          fillColor: '#dc2626',
          fillOpacity: 0.42,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif;">
              <div style="background: #fef2f2; border-left: 3px solid #dc2626; padding: 4px 6px; margin-bottom: 6px;">
                <strong style="color: #991b1b; font-size: 13px;">Detected Flood Extent</strong><br/>
                <span style="font-size: 11px; color: #7f1d1d;">Sentinel-1 SAR C-Band Change Mask</span>
              </div>
              <div><strong>Threshold:</strong> ${feature.properties?.sigma0_threshold || '< -16.5 dB VV'}</div>
              <div><strong>Confidence:</strong> ${feature.properties?.confidence || '0.91 (High)'}</div>
              <div style="margin-top: 4px; font-size: 10px; color: #64748b;">
                *Specular radar reflection on smooth flood surface
              </div>
            </div>
          `);
        },
      }).addTo(floodExtentGroup);
    }

    // 3. 500m Buffer Zone
    const isBufferVisible = showBufferZone && (activeStage === null || activeStage >= 3);
    if (isBufferVisible && layers.bufferZone) {
      L.geoJSON(layers.bufferZone, {
        style: {
          color: '#d97706',
          weight: 1.5,
          dashArray: '5, 5',
          fillColor: '#fef3c7',
          fillOpacity: 0.18,
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif;">
              <strong style="color: #d97706;">500m Impact & Preparedness Buffer Zone</strong><br/>
              <span style="color: #64748b; font-size: 11px;">Identifies infrastructure at immediate perimeter risk</span>
            </div>
          `);
        },
      }).addTo(bufferZoneGroup);
    }

    // 4. Roads (Affected vs Alternative Routes)
    const isRoadsVisible = showRoads && (activeStage === null || activeStage >= 3);
    if (isRoadsVisible && layers.roads) {
      layers.roads.forEach((rd) => {
        const isAffected = rd.status.includes('Potentially Affected') || rd.status.includes('Severed');
        const color = isAffected ? '#dc2626' : '#16a34a';

        const polyline = L.polyline(rd.coordinates, {
          color: color,
          weight: isAffected ? 4.5 : 3.5,
          dashArray: isAffected ? '8, 6' : undefined,
          opacity: 0.85,
        });

        polyline.bindPopup(`
          <div style="font-size: 12px; font-family: sans-serif; max-width: 240px;">
            <strong style="color: ${color};">${rd.name}</strong><br/>
            <div><strong>Type:</strong> ${rd.type}</div>
            <div><strong>Status:</strong> ${rd.status}</div>
            ${rd.lengthAffectedKm ? `<div><strong>Affected:</strong> ${rd.lengthAffectedKm} km</div>` : ''}
            ${
              rd.hasAlternative
                ? `<div style="margin-top: 6px; padding: 4px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; font-size: 11px; color: #166534;">
                     <strong>Alternative Route:</strong> ${rd.alternativeRouteName || 'Identified Bypass'}<br/>
                     <em>${rd.alternativeNotes}</em>
                   </div>`
                : ''
            }
          </div>
        `);
        polyline.addTo(roadsGroup);
      });
    }

    // 5. Critical Facilities & Settlements Markers
    const isFacilitiesVisible = activeStage === null || activeStage >= 3;
    if (isFacilitiesVisible) {
      // Hospitals
      if (showHospitals && layers.hospitals) {
        layers.hospitals.forEach((hosp) => {
          const isCritical = hosp.priority === 'CRITICAL';
          const iconHtml = `
            <div style="background-color: ${isCritical ? '#dc2626' : '#ea580c'}; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 14px;">
              +
            </div>
          `;
          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'facility-hospital-marker',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          const marker = L.marker(hosp.coordinates, { icon: customIcon });
          marker.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif; max-width: 250px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 10px; font-weight: bold; background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 3px;">
                  ${hosp.priority}
                </span>
                <span style="font-size: 11px; color: #64748b;">${hosp.status}</span>
              </div>
              <strong style="color: #0f172a; font-size: 13px;">${hosp.name}</strong>
              <div style="margin-top: 6px; font-size: 11px; line-height: 1.4;">
                <div><strong>Type:</strong> ${hosp.type}</div>
                <div><strong>Backup Power:</strong> ${hosp.backupPower || 'Standard'}</div>
                <div><strong>Oxygen Supply:</strong> ${hosp.oxygenSupply || 'Normal'}</div>
                <div style="margin-top: 4px; padding: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                  <strong>Action:</strong> ${hosp.recommendedAction}
                </div>
              </div>
            </div>
          `);
          marker.addTo(facilitiesGroup);
        });
      }

      // Schools / Educational Facilities
      if (showSchools && layers.educationalFacilities) {
        layers.educationalFacilities.forEach((edu) => {
          const iconHtml = `
            <div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.25); color: white; font-size: 11px;">
              🎓
            </div>
          `;
          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'facility-school-marker',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const marker = L.marker(edu.coordinates, { icon: customIcon });
          marker.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif; max-width: 230px;">
              <span style="font-size: 10px; font-weight: bold; background: #eff6ff; color: #1e40af; padding: 2px 6px; border-radius: 3px;">
                ${edu.type}
              </span>
              <div style="margin-top: 4px; font-weight: bold; color: #0f172a;">${edu.name}</div>
              <div style="font-size: 11px; margin-top: 4px; color: #475569;">
                <div><strong>Status:</strong> ${edu.status}</div>
                <div><strong>Capacity:</strong> ${edu.capacity} occupants</div>
                <div style="margin-top: 4px; color: #0369a1;"><em>${edu.preparednessStatus}</em></div>
              </div>
            </div>
          `);
          marker.addTo(facilitiesGroup);
        });
      }

      // Settlements
      if (showSettlements && layers.settlements) {
        layers.settlements.forEach((set) => {
          const isCritical = set.priority === 'CRITICAL';
          const iconHtml = `
            <div style="background-color: ${isCritical ? '#991b1b' : '#334155'}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>
          `;
          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'settlement-marker',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          const marker = L.marker(set.coordinates, { icon: customIcon });
          marker.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif;">
              <strong>${set.name}</strong><br/>
              <span style="color: #64748b;">${set.type}</span><br/>
              <div style="margin-top: 4px;">
                <strong>Exposure:</strong> ${set.status}<br/>
                ${set.populationExposed ? `<strong>Exposed Pop:</strong> ~${set.populationExposed.toLocaleString()}<br/>` : ''}
                <span style="font-size: 11px; color: #475569;">${set.notes || ''}</span>
              </div>
            </div>
          `);
          marker.addTo(facilitiesGroup);
        });
      }
    }
  }, [
    layers,
    showFloodExtent,
    showBaselineWater,
    showBufferZone,
    showRoads,
    showHospitals,
    showSchools,
    showSettlements,
    activeStage,
  ]);

  const handleResetBounds = () => {
    if (mapInstanceRef.current) {
      if (bounds) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [25, 25] });
      } else {
        mapInstanceRef.current.setView(center, zoom);
      }
    }
  };

  return (
    <div className="map-wrapper" style={{ height: height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Layer Visibility Control Panel */}
      <div className="map-controls-panel">
        <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
          GIS Map Layers
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={useSatelliteBasemap}
              onChange={(e) => setUseSatelliteBasemap(e.target.checked)}
            />
            <span>Satellite Imagery</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showFloodExtent}
              onChange={(e) => setShowFloodExtent(e.target.checked)}
            />
            <span style={{ fontWeight: 600, color: '#b91c1c' }}>Detected Flood Extent</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showBaselineWater}
              onChange={(e) => setShowBaselineWater(e.target.checked)}
            />
            <span style={{ color: '#0369a1' }}>Baseline Permanent Water</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showBufferZone}
              onChange={(e) => setShowBufferZone(e.target.checked)}
            />
            <span style={{ color: '#b45309' }}>500m Buffer Watch Zone</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showRoads}
              onChange={(e) => setShowRoads(e.target.checked)}
            />
            <span>Road Lifelines & Bypass</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showHospitals}
              onChange={(e) => setShowHospitals(e.target.checked)}
            />
            <span>Hospitals & Health Centers</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showSchools}
              onChange={(e) => setShowSchools(e.target.checked)}
            />
            <span>Schools & Colleges</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showSettlements}
              onChange={(e) => setShowSettlements(e.target.checked)}
            />
            <span>Settlement Nodes</span>
          </label>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '0.6rem', fontSize: '0.72rem', padding: '0.25rem' }}
          onClick={handleResetBounds}
        >
          Reset View Extent
        </button>
      </div>

      {/* GIS Legend */}
      <div className="map-legend">
        <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Map Legend
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: '#dc2626', opacity: 0.7 }} />
          <span>Detected Flood Extent (SAR)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: '#0284c7', opacity: 0.7 }} />
          <span>Baseline Water (Pre-Flood)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ border: '1px dashed #d97706', backgroundColor: '#fef3c7' }} />
          <span>500m Buffer Watch Zone</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ borderTop: '2px dashed #dc2626', height: 2, width: 16 }} />
          <span>Affected Road Lifeline</span>
        </div>
        <div className="legend-item">
          <div className="legend-color-box" style={{ borderTop: '2px dashed #16a34a', height: 2, width: 16 }} />
          <span>Potential Alternative Bypass</span>
        </div>
        <div className="legend-item">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' }}>+</div>
          <span>Hospital / Primary Clinic</span>
        </div>
        <div className="legend-item">
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>🎓</div>
          <span>School / College</span>
        </div>
      </div>
    </div>
  );
}

export default MapView;
