import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Satellite, 
  Map as MapIcon, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Search, 
  MapPin, 
  Compass, 
  Radio, 
  Crosshair, 
  Building2, 
  BookOpen, 
  Home, 
  Award, 
  Star, 
  Filter, 
  X, 
  Check, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Ruler, 
  Share2, 
  ExternalLink, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import L from 'leaflet';
import { Institution, Language, Wilaya, MapTileLayer } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { TRANSLATIONS } from '../data/translations';
import { calculateDistanceKm, getDirectionsUrl } from '../utils/geoAndCalendar';

interface DedicatedSatelliteMapProps {
  institutions: Institution[];
  language: Language;
  selectedInstitution: Institution | null;
  onSelectInstitution: (inst: Institution) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onOpenDetailsModal?: (inst: Institution) => void;
}

// Kaaba Coordinates in Mecca Al-Mukarramah
const KAABA_COORDS = { lat: 21.4225, lng: 39.8262 };

export const DedicatedSatelliteMap: React.FC<DedicatedSatelliteMapProps> = ({
  institutions,
  language,
  selectedInstitution,
  onSelectInstitution,
  favorites,
  toggleFavorite,
  onOpenDetailsModal
}) => {
  const t = TRANSLATIONS[language];

  // Container refs & Leaflet objects
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const qiblaLineRef = useRef<L.Polyline | null>(null);
  const measureLineRef = useRef<L.Polyline | null>(null);
  const radarCircleRef = useRef<L.Circle | null>(null);

  // States
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'hybrid' | 'google_sat' | 'osm' | 'topo' | 'dark'>('hybrid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Advanced Tools
  const [showQiblaRay, setShowQiblaRay] = useState(true);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureDistance, setMeasureDistance] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStats, setScanStats] = useState<{ total: number; verified: number; mosques: number; schools: number } | null>(null);
  const [activeCardInst, setActiveCardInst] = useState<Institution | null>(selectedInstitution);

  // Realtime Map Telemetry HUD
  const [telemetry, setTelemetry] = useState({
    lat: 34.5000,
    lng: 3.5000,
    zoom: 6,
    qiblaBearing: 104,
    visibleCount: institutions.length
  });

  // Calculate Qibla Bearing from given coordinates
  const calculateQiblaBearing = useCallback((lat: number, lng: number) => {
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (KAABA_COORDS.lat * Math.PI) / 180;
    const deltaLambda = ((KAABA_COORDS.lng - lng) * Math.PI) / 180;
    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((qibla + 360) % 360);
  }, []);

  // Filtered institutions
  const filteredList = useMemo(() => {
    return institutions.filter((inst) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = inst.name.toLowerCase().includes(q);
        const matchWilaya = inst.wilayaNameAr.toLowerCase().includes(q);
        const matchCommune = inst.commune.toLowerCase().includes(q);
        const matchSheikh = inst.imamOrSheikh.toLowerCase().includes(q);
        if (!matchName && !matchWilaya && !matchCommune && !matchSheikh) return false;
      }
      if (selectedWilaya !== 'all' && inst.wilayaCode !== selectedWilaya) return false;
      if (selectedType !== 'all' && inst.type !== selectedType) return false;
      return true;
    });
  }, [institutions, searchQuery, selectedWilaya, selectedType]);

  // Set Tile Layer Implementation
  const setMapTileLayer = useCallback((layerType: 'satellite' | 'hybrid' | 'google_sat' | 'osm' | 'topo' | 'dark') => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Clean old base layers
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (labelsLayerRef.current) {
      map.removeLayer(labelsLayerRef.current);
      labelsLayerRef.current = null;
    }

    let base: L.TileLayer;

    switch (layerType) {
      case 'satellite':
        // Pure High-Resolution Esri World Imagery
        base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });
        break;

      case 'hybrid':
        // Esri Satellite + High Contrast Carto Labels with Algerian city names
        base = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: 'Imagery &copy; Esri'
        });
        const labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          pane: 'overlayPane'
        });
        labels.addTo(map);
        labelsLayerRef.current = labels;
        break;

      case 'google_sat':
        // Google Maps Hybrid Satellite Tiles
        base = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        });
        break;

      case 'topo':
        // OpenTopoMap with topographic contours & elevation
        base = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
          attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
        });
        break;

      case 'dark':
        // CartoDB Dark Matter for Night Exploration
        base = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        });
        break;

      case 'osm':
      default:
        // OpenStreetMap Standard Street
        base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        });
        break;
    }

    base.addTo(map);
    baseTileLayerRef.current = base;
    setActiveLayer(layerType);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [34.5, 3.5], // Center of Algeria
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Create Layer Groups
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      leafletMapRef.current = map;

      // Set initial satellite hybrid layer
      setMapTileLayer('hybrid');

      // Update Telemetry on Move
      map.on('moveend', () => {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const inView = institutions.filter(i => bounds.contains([i.lat, i.lng])).length;
        const bearing = calculateQiblaBearing(center.lat, center.lng);

        setTelemetry({
          lat: Number(center.lat.toFixed(4)),
          lng: Number(center.lng.toFixed(4)),
          zoom: map.getZoom(),
          qiblaBearing: bearing,
          visibleCount: inView
        });
      });

      // Measurement click handler
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (!isMeasuring) return;
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        
        setMeasurePoints(prev => {
          if (prev.length >= 2) {
            return [newPoint];
          }
          const updated = [...prev, newPoint];
          if (updated.length === 2) {
            const dist = calculateDistanceKm(updated[0][0], updated[0][1], updated[1][0], updated[1][1]);
            setMeasureDistance(dist);
          }
          return updated;
        });
      });
    }

    // Force tile recalculation multiple times to prevent blank/gray states
    const timer1 = setTimeout(() => leafletMapRef.current?.invalidateSize(), 50);
    const timer2 = setTimeout(() => leafletMapRef.current?.invalidateSize(), 250);
    const timer3 = setTimeout(() => leafletMapRef.current?.invalidateSize(), 600);

    const resizeObserver = new ResizeObserver(() => {
      leafletMapRef.current?.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      resizeObserver.disconnect();
    };
  }, [institutions, calculateQiblaBearing, isMeasuring, setMapTileLayer]);

  // Handle Measurement Line Rendering
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    if (measureLineRef.current) {
      map.removeLayer(measureLineRef.current);
      measureLineRef.current = null;
    }

    if (measurePoints.length === 2) {
      const line = L.polyline(measurePoints, {
        color: '#f59e0b',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.9
      }).addTo(map);
      measureLineRef.current = line;
    }
  }, [measurePoints]);

  // Handle Qibla Ray Rendering
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;

    if (qiblaLineRef.current) {
      map.removeLayer(qiblaLineRef.current);
      qiblaLineRef.current = null;
    }

    if (showQiblaRay) {
      const startPoint = userLocation || { lat: 36.7538, lng: 3.0588 }; // User or Algiers center
      const ray = L.polyline(
        [[startPoint.lat, startPoint.lng], [KAABA_COORDS.lat, KAABA_COORDS.lng]],
        {
          color: '#10b981',
          weight: 2,
          opacity: 0.75,
          dashArray: '5, 10'
        }
      ).addTo(map);

      qiblaLineRef.current = ray;
    }
  }, [showQiblaRay, userLocation]);

  // Render Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // User GPS location marker
    if (userLocation) {
      const userDiv = L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-75"></span>
            <div class="w-7 h-7 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-xl">
              <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userDiv })
        .bindPopup(`
          <div class="text-center font-sans p-1">
            <div class="font-bold text-emerald-700 text-xs">موقعك الجغرافي المباشر</div>
            <div class="text-[10px] text-slate-500 font-mono">${userLocation.lat.toFixed(4)}°, ${userLocation.lng.toFixed(4)}°</div>
          </div>
        `)
        .addTo(markersLayerRef.current);
    }

    // Mecca Kaaba Marker
    const kaabaIcon = L.divIcon({
      className: 'kaaba-marker',
      html: `
        <div class="group relative cursor-pointer transform hover:scale-125 transition duration-200">
          <div class="w-8 h-8 bg-slate-950 border-2 border-amber-400 rounded-lg flex items-center justify-center text-amber-300 font-bold text-xs shadow-xl">
            🕋
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-r border-b border-amber-400"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([KAABA_COORDS.lat, KAABA_COORDS.lng], { icon: kaabaIcon })
      .bindTooltip('<div class="font-bold text-slate-900 text-xs">مكة المكرمة - الكعبة المشرفة (قبلة المسلمين)</div>', { direction: 'top' })
      .addTo(markersLayerRef.current);

    // Institution Markers
    filteredList.forEach((inst) => {
      const isSelected = activeCardInst?.id === inst.id;
      
      const badgeColor = 
        inst.type === 'zawiya' ? 'bg-amber-600' : 
        inst.type === 'mosque' ? 'bg-emerald-700' : 
        inst.type === 'dar_quran' ? 'bg-blue-600' : 'bg-teal-700';

      const iconSymbol = 
        inst.type === 'zawiya' ? '🕌' : 
        inst.type === 'mosque' ? '🌙' : '📖';

      const html = `
        <div class="group relative cursor-pointer transform transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
          ${isSelected ? '<span class="animate-ping absolute -inset-1 rounded-full bg-amber-400 opacity-90"></span>' : ''}
          <div class="w-8 h-8 ${badgeColor} rounded-full border-2 ${isSelected ? 'border-amber-400 ring-4 ring-amber-400/40 shadow-2xl' : 'border-white shadow-lg'} flex items-center justify-center text-white relative">
            <span style="font-size: 14px;">${iconSymbol}</span>
            ${inst.verified ? '<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border border-white rounded-full flex items-center justify-center text-[7px] text-slate-950 font-bold">✓</div>' : ''}
          </div>
          ${isSelected ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-400 rotate-45"></div>' : ''}
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'inst-satellite-marker',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([inst.lat, inst.lng], { icon: markerIcon });

      marker.on('click', () => {
        setActiveCardInst(inst);
        onSelectInstitution(inst);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([inst.lat, inst.lng], Math.max(leafletMapRef.current.getZoom(), 12), { duration: 0.8 });
        }
      });

      marker.bindTooltip(`
        <div style="direction: rtl; text-align: right; padding: 3px; font-family: sans-serif;">
          <div style="font-weight: 800; font-size: 12px; color: #0f172a;">${inst.name}</div>
          <div style="font-size: 10px; color: #475569;">${inst.wilayaNameAr} • ${inst.commune}</div>
          <div style="font-size: 10px; color: #d97706; font-weight: bold; margin-top: 2px;">⭐ ${inst.rating} (${inst.reviewsCount} تقييم)</div>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredList, activeCardInst, userLocation, onSelectInstitution]);

  // Geolocation Handler
  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1.2 });
        }
      },
      () => {
        // Fallback Algiers
        const fallback = { lat: 36.7538, lng: 3.0588 };
        setUserLocation(fallback);
        setIsLocating(false);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([fallback.lat, fallback.lng], 12, { duration: 1.2 });
        }
      },
      { timeout: 7000 }
    );
  };

  // Wilaya Zoom Handler
  const handleWilayaSelect = (code: string) => {
    setSelectedWilaya(code);
    if (code === 'all') {
      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([34.5, 3.5], 6, { duration: 1.2 });
      }
      return;
    }
    const w = ALGERIA_WILAYAS.find(item => item.code === code);
    if (w && leafletMapRef.current) {
      leafletMapRef.current.flyTo([w.lat, w.lng], 11, { duration: 1.2 });
    }
  };

  // Radar Scan Handler
  const handleTriggerRadarScan = () => {
    if (!leafletMapRef.current) return;
    const map = leafletMapRef.current;
    const center = map.getCenter();
    const bounds = map.getBounds();

    setIsScanning(true);

    if (radarCircleRef.current) {
      map.removeLayer(radarCircleRef.current);
    }

    const radius = Math.max(12000, (bounds.getNorth() - bounds.getSouth()) * 35000);
    const circle = L.circle([center.lat, center.lng], {
      radius,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '6, 8'
    }).addTo(map);

    radarCircleRef.current = circle;

    setTimeout(() => {
      const inBounds = institutions.filter(inst => bounds.contains([inst.lat, inst.lng]));
      const list = inBounds.length > 0 ? inBounds : institutions.slice(0, 8);
      
      setScanStats({
        total: list.length,
        verified: list.filter(i => i.verified).length,
        mosques: list.filter(i => i.type === 'mosque').length,
        schools: list.filter(i => i.type === 'quranic_school' || i.type === 'dar_quran').length
      });
      setIsScanning(false);

      setTimeout(() => {
        if (radarCircleRef.current) {
          map.removeLayer(radarCircleRef.current);
          radarCircleRef.current = null;
        }
      }, 3500);
    }, 1000);
  };

  // Fullscreen Toggle
  const toggleFullScreenMode = () => {
    if (!document.fullscreenElement) {
      if (fullScreenContainerRef.current?.requestFullscreen) {
        fullScreenContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    setTimeout(() => leafletMapRef.current?.invalidateSize(), 300);
  };

  return (
    <div 
      ref={fullScreenContainerRef}
      className={`relative w-full overflow-hidden bg-slate-950 font-sans select-none ${
        isFullscreen ? 'h-screen' : 'h-[calc(100vh-4rem)] min-h-[600px]'
      }`}
    >
      {/* 1. Main Fullscreen Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* 2. Top Header HUD Bar (Translucent Glassmorphism) */}
      <div className="absolute top-3 inset-x-3 z-30 pointer-events-none flex items-center justify-between gap-2">
        {/* Left Side: Brand Badge & Active Wilaya */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-2xl text-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <Satellite className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-100">
                المستكشف الفضائي الوطني (GIS)
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                مباشر
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>{telemetry.lat.toFixed(4)}°N, {telemetry.lng.toFixed(4)}°E</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-sans">زووم: {telemetry.zoom}</span>
            </div>
          </div>
        </div>

        {/* Center / Right Controls: Quick Wilaya Jump & Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* 58-Wilaya Quick Switcher */}
          <div className="hidden md:block">
            <select
              value={selectedWilaya}
              onChange={(e) => handleWilayaSelect(e.target.value)}
              className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xl"
            >
              <option value="all">🇩🇿 الانتقال لولاية (58 ولاية)</option>
              {ALGERIA_WILAYAS.map(w => (
                <option key={w.code} value={w.code} className="bg-slate-900 text-white">
                  {w.code} - {w.nameAr} ({w.nameFr})
                </option>
              ))}
            </select>
          </div>

          {/* Qibla Direction Toggle */}
          <button
            onClick={() => setShowQiblaRay(!showQiblaRay)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-xl cursor-pointer ${
              showQiblaRay
                ? 'bg-emerald-900/90 border-emerald-500 text-emerald-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="إظهار شعاع اتجاه القبلة الشريفة نحو الكعبة"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">اتجاه القبلة ({telemetry.qiblaBearing}°)</span>
          </button>

          {/* Distance Measurement Tool */}
          <button
            onClick={() => {
              setIsMeasuring(!isMeasuring);
              setMeasurePoints([]);
              setMeasureDistance(null);
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-xl cursor-pointer ${
              isMeasuring
                ? 'bg-amber-900/90 border-amber-500 text-amber-200'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="أداة قياس المسافات الفضائية بين نقطتين على الخريطة"
          >
            <Ruler className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">{isMeasuring ? 'انقر على نقطتين' : 'قياس المسافة'}</span>
          </button>

          {/* Spatial Radar Scanner */}
          <button
            onClick={handleTriggerRadarScan}
            disabled={isScanning}
            className="p-2.5 bg-linear-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-xl cursor-pointer disabled:opacity-50"
            title="مسح المنطقة ورصد المساجد والمدارس القرآنية"
          >
            <Radio className={`w-4 h-4 text-amber-300 ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
            <span className="hidden sm:inline">{isScanning ? 'جاري الرصد...' : 'رادار المنطقة'}</span>
          </button>

          {/* Geolocation GPS */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 text-xs font-bold transition shadow-xl cursor-pointer"
            title="تحديد موقعي المباشر"
          >
            <Navigation className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullScreenMode}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 text-xs font-bold transition shadow-xl cursor-pointer"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة بالكامل'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Sidebar Drawer Toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition shadow-xl cursor-pointer ${
              showSidebar
                ? 'bg-emerald-800 border-emerald-600 text-white'
                : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="فتح/إغلاق قائمة المدارس والمعالم"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Floating Layer Selector (Top Left / Right Floating Widget) */}
      <div className="absolute top-18 start-3 z-30 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowLayerPicker(!showLayerPicker)}
            className="bg-slate-900/90 hover:bg-slate-900 text-slate-100 px-3 py-2 rounded-xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 backdrop-blur-md transition cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>نمط الساتيليت</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              {activeLayer === 'hybrid' ? 'فضائي هجين' : activeLayer === 'satellite' ? 'فضائي نقي' : activeLayer === 'google_sat' ? 'Google' : activeLayer === 'topo' ? 'تضاريس' : activeLayer === 'dark' ? 'ليلي' : 'شوارع'}
            </span>
          </button>

          {showLayerPicker && (
            <div className="absolute start-0 top-11 w-56 bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700 p-2 space-y-1 z-40 text-slate-100">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800">
                طبقات التصوير الفضائي والخرائط
              </div>

              {[
                { id: 'hybrid', name: 'فضائي هجين (Esri + أسماء المدن)', desc: 'أقمار صناعية مع تسميات عربية واضحة', icon: Sparkles },
                { id: 'satellite', name: 'أقمار صناعية نقية (Esri Imagery)', desc: 'تصوير فضائي عالي الدقة دون نصوص', icon: Satellite },
                { id: 'google_sat', name: 'قمر صناعي Google Hybrid', desc: 'تغطية Google الفضائية الشاملة', icon: MapIcon },
                { id: 'topo', name: 'تضاريس وجبال (OpenTopoMap)', desc: 'خطوط الارتفاع والتضاريس الجغرافية', icon: Compass },
                { id: 'dark', name: 'النمط الليلي الفضائي (Night Mode)', desc: 'خريطة ليلية هادئة عالية التباين', icon: Eye },
                { id: 'osm', name: 'خريطة الشوارع والمسالك (OSM)', desc: 'طرق وشوارع مفصلة', icon: MapPin }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMapTileLayer(item.id as any);
                    setShowLayerPicker(false);
                  }}
                  className={`w-full p-2 rounded-xl text-start text-xs flex items-center gap-2.5 transition cursor-pointer ${
                    activeLayer === item.id
                      ? 'bg-emerald-900/60 text-emerald-200 font-bold border border-emerald-600'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeLayer === item.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="flex-1">
                    <div className="text-xs">{item.name}</div>
                    <div className="text-[9px] text-slate-400">{item.desc}</div>
                  </div>
                  {activeLayer === item.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Measurement Distance Live Result Floating Box */}
      {measureDistance !== null && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-amber-950/90 text-amber-200 border border-amber-500/50 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 text-xs">
          <Ruler className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>المسافة المباشرة: <strong className="text-amber-100 font-mono text-sm">{measureDistance} كم</strong> ({Math.round(measureDistance * 1000).toLocaleString()} متر)</span>
          <button
            onClick={() => {
              setMeasurePoints([]);
              setMeasureDistance(null);
            }}
            className="text-amber-400 hover:text-white px-1.5 py-0.5 rounded bg-amber-900/60 font-bold cursor-pointer"
          >
            ✕ مسح
          </button>
        </div>
      )}

      {/* 5. Radar Scan Report Popover */}
      {scanStats && (
        <div className="absolute top-18 end-3 z-30 pointer-events-auto w-72 bg-slate-900/95 text-white border border-emerald-500/60 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl text-xs space-y-2 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Radio className="w-4 h-4" />
              <span>تقرير الرصد الفضائي للمنطقة</span>
            </div>
            <button onClick={() => setScanStats(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="bg-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block">إجمالي المعالم</span>
              <span className="text-emerald-400 font-extrabold text-sm">{scanStats.total}</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block">معتمدة رسمياً</span>
              <span className="text-teal-400 font-extrabold text-sm">{scanStats.verified}</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block">مساجد وجوامع</span>
              <span className="text-amber-400 font-extrabold text-sm">{scanStats.mosques}</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-2">
              <span className="text-[10px] text-slate-400 block">مدارس قرآنية</span>
              <span className="text-blue-400 font-extrabold text-sm">{scanStats.schools}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Collapsible Search & Institution Drawer (Floating on Right/Start Side) */}
      {showSidebar && (
        <div className="absolute top-18 end-3 bottom-12 w-80 sm:w-96 z-20 pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Drawer Header */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>المعالم والمدارس القرآنية ({filteredList.length})</span>
              </div>
              <button 
                onClick={() => setShowSidebar(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الولاية أو الإمام..."
                className="w-full ps-8 pe-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'mosque', label: 'مساجد' },
                { id: 'quranic_school', label: 'مدارس' },
                { id: 'zawiya', label: 'زوايا' },
                { id: 'dar_quran', label: 'دور القرآن' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedType(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
                    selectedType === cat.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                <p>لا توجد نتائج مطابقة لبحثك</p>
              </div>
            ) : (
              filteredList.map((inst) => {
                const isSelected = activeCardInst?.id === inst.id;
                const isFav = favorites.includes(inst.id);

                return (
                  <div
                    key={inst.id}
                    onClick={() => {
                      setActiveCardInst(inst);
                      onSelectInstitution(inst);
                      if (leafletMapRef.current) {
                        leafletMapRef.current.flyTo([inst.lat, inst.lng], 14, { duration: 1.0 });
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-slate-200 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            inst.type === 'zawiya' ? 'bg-amber-900/80 text-amber-200' :
                            inst.type === 'mosque' ? 'bg-emerald-900/80 text-emerald-200' :
                            inst.type === 'dar_quran' ? 'bg-blue-900/80 text-blue-200' : 'bg-teal-900/80 text-teal-200'
                          }`}>
                            {inst.type === 'zawiya' ? 'زاوية' : inst.type === 'mosque' ? 'مسجد جامع' : 'مدرسة قرآنية'}
                          </span>
                          {inst.verified && (
                            <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> معتمد
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-xs sm:text-sm leading-snug">
                          {inst.name}
                        </h4>

                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{inst.wilayaNameAr} • {inst.commune}</span>
                        </div>
                      </div>

                      {/* Favorite Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(inst.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Action Footer inside card */}
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        ⭐ {inst.rating} ({inst.studentCount} طالب)
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={getDirectionsUrl(inst.lat, inst.lng, userLocation?.lat, userLocation?.lng)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>مسار</span>
                        </a>

                        {onOpenDetailsModal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetailsModal(inst);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>الملف</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 7. Bottom Active Institution Floating HUD Card (When clicked) */}
      {activeCardInst && (
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:start-3 sm:max-w-md z-20 pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-3.5 shadow-2xl text-white space-y-2 animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  {activeCardInst.type === 'zawiya' ? 'زاوية عريقة' : activeCardInst.type === 'mosque' ? 'مسجد جامع' : 'مدرسة قرآنية نموذجية'}
                </span>
                {activeCardInst.registrationNumber && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {activeCardInst.registrationNumber}
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {activeCardInst.name}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeCardInst.wilayaNameAr} • {activeCardInst.commune} • {activeCardInst.imamOrSheikh}</span>
              </p>
            </div>
            <button 
              onClick={() => setActiveCardInst(null)} 
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="text-amber-300 font-bold">
              ⭐ {activeCardInst.rating} ({activeCardInst.reviewsCount} تقييم)
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getDirectionsUrl(activeCardInst.lat, activeCardInst.lng, userLocation?.lat, userLocation?.lng)}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>المسار</span>
              </a>

              {onOpenDetailsModal && (
                <button
                  onClick={() => onOpenDetailsModal(activeCardInst)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/50 cursor-pointer"
                >
                  <span>عرض التفاصيل الكاملة</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Bottom Status HUD Bar */}
      <div className="absolute bottom-2 end-3 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
        <span>القمر الصناعي: Esri/Google GIS</span>
        <span>•</span>
        <span>النطاق الجزائري: 58 ولاية</span>
        <span>•</span>
        <span>قبلة مكة: {telemetry.qiblaBearing}°</span>
      </div>
    </div>
  );
};
