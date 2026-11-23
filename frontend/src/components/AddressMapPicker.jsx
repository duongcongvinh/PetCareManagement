import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, ExternalLink, Layers, Loader2, X } from 'lucide-react';
import { toast } from './ToastNotification';

const DEFAULT_CENTER = { lat: 10.822159, lng: 106.687451 }; // Số 12 Nguyễn Văn Bảo, Phường Hạnh Thông, TP. Hồ Chí Minh

const QUICK_CITIES = [
  { label: 'TP.HCM', lat: 10.776889, lng: 106.700806 },
  { label: 'Hà Nội', lat: 21.028511, lng: 105.854165 },
  { label: 'Đà Nẵng', lat: 16.054407, lng: 108.202167 },
];

const createPetzeraPinIcon = () =>
  L.divIcon({
    className: 'petzera-map-pin',
    html: `
      <div style="position:relative;width:36px;height:44px;display:flex;align-items:center;justify-content:center;">
        <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 8px rgba(234,88,12,0.45));">
          <path d="M18 0C8.05887 0 0 8.05887 0 18C0 30.5 18 44 18 44C18 44 36 30.5 36 18C36 8.05887 27.9411 0 18 0Z" fill="#ff6b35"/>
          <circle cx="18" cy="17.5" r="7.5" fill="#ffffff"/>
          <circle cx="18" cy="17.5" r="3.5" fill="#ea580c"/>
        </svg>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
  });

const formatVietnameseAddress = (data) => {
  if (!data) return '';
  const addr = data.address || {};
  const street = [addr.house_number, addr.road || addr.pedestrian || addr.footway]
    .filter(Boolean)
    .join(' ');
  const parts = [
    addr.amenity || addr.building || addr.shop,
    street,
    addr.quarter || addr.suburb || addr.neighbourhood || addr.village || addr.hamlet,
    addr.city_district || addr.district || addr.county || addr.town,
    addr.city || addr.state || addr.province,
  ].filter(Boolean);

  // Deduplicate adjacent identical labels
  const uniqueParts = [];
  for (const part of parts) {
    if (!uniqueParts.some((u) => u.toLowerCase() === part.toLowerCase())) {
      uniqueParts.push(part);
    }
  }
  return uniqueParts.length >= 2 ? uniqueParts.join(', ') : (data.display_name || '');
};

export default function AddressMapPicker({ value, coords, onSelectAddress }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const skipNextSearchRef = useRef(false);

  const [pinCoords, setPinCoords] = useState(coords || DEFAULT_CENTER);
  const [hasPicked, setHasPicked] = useState(Boolean(coords));
  const [mapStyle, setMapStyle] = useState('ROAD'); // 'ROAD' | 'SATELLITE'
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);

  const reverseGeocode = async (lat, lng) => {
    setResolvingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=vi&lat=${lat}&lon=${lng}`,
        { headers: { Accept: 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        const formatted = formatVietnameseAddress(data);
        if (formatted) {
          onSelectAddress({ address: formatted, lat, lng });
          return;
        }
      }
      onSelectAddress({
        address: value || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      });
    } catch (err) {
      console.warn('Reverse geocode error:', err);
      onSelectAddress({
        address: value || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      });
    } finally {
      setResolvingAddress(false);
    }
  };

  const movePinTo = (lat, lng, { shouldReverse = true, zoom = 16 } = {}) => {
    setPinCoords({ lat, lng });
    setHasPicked(true);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 0.65 });
    }
    if (shouldReverse) {
      reverseGeocode(lat, lng);
    }
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initial = coords || DEFAULT_CENTER;
    const map = L.map(mapContainerRef.current, {
      center: [initial.lat, initial.lng],
      zoom: coords ? 16 : 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    const roadLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = roadLayer;

    const marker = L.marker([initial.lat, initial.lng], {
      draggable: true,
      icon: createPetzeraPinIcon(),
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setPinCoords({ lat: pos.lat, lng: pos.lng });
      setHasPicked(true);
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setPinCoords({ lat, lng });
      setHasPicked(true);
      reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 180);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Switch between Road & Satellite layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const url =
      mapStyle === 'SATELLITE'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution =
      mapStyle === 'SATELLITE' ? '&copy; Esri Imagery' : '&copy; OpenStreetMap';
    tileLayerRef.current = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
  }, [mapStyle]);

  // Debounced Vietnamese Address Search
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    const q = searchText.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=vn&limit=5&accept-language=vi&q=${encodeURIComponent(q)}`,
          { signal: controller.signal, headers: { Accept: 'application/json' } }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Address search error:', err);
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchText]);

  const handleManualSearch = async () => {
    const q = searchText.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=vn&limit=5&accept-language=vi&q=${encodeURIComponent(q)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
          toast.info('Không tìm thấy địa điểm khớp. Bạn có thể bấm trực tiếp lên bản đồ để ghim vị trí!', 'Tìm Địa Chỉ');
        }
      }
    } catch (err) {
      toast.warning('Không thể tìm kiếm bản đồ lúc này. Bạn vẫn có thể bấm chọn trực tiếp trên bản đồ.', 'Bản Đồ');
    } finally {
      setSearching(false);
    }
  };

  const handlePickSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const formatted = formatVietnameseAddress(item) || item.display_name;
    skipNextSearchRef.current = true;
    setSearchText(formatted);
    setSuggestions([]);
    movePinTo(lat, lng, { shouldReverse: false, zoom: 16 });
    onSelectAddress({ address: formatted, lat, lng });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.warning('Trình duyệt không hỗ trợ định vị GPS.', 'Định Vị');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        movePinTo(latitude, longitude, { shouldReverse: true, zoom: 17 });
        setLocating(false);
        toast.success('Đã xác định vị trí hiện tại của bạn trên bản đồ!', '📍 Định Vị GPS');
      },
      () => {
        setLocating(false);
        toast.warning('Không thể lấy vị trí GPS (vui lòng cấp quyền vị trí hoặc bấm chọn trực tiếp trên bản đồ).', 'Định Vị GPS');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pinCoords.lat.toFixed(6)},${pinCoords.lng.toFixed(6)}`;

  return (
    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '0.95rem', marginTop: '0.65rem' }}>
      {/* Top Search & GPS Toolbar */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.65rem', position: 'relative' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="form-control"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleManualSearch();
              }
            }}
            placeholder="Tìm địa chỉ trên bản đồ (VD: Cầu Giấy, Hà Nội hoặc Quận 1)..."
            style={{ paddingLeft: '34px', paddingRight: searchText ? '32px' : '12px', paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: '0.84rem' }}
          />
          {searchText && (
            <button
              type="button"
              onClick={() => { setSearchText(''); setSuggestions([]); }}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex' }}
              title="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 5px)',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
                zIndex: 40,
                maxHeight: '210px',
                overflowY: 'auto',
              }}
            >
              {suggestions.map((item) => (
                <button
                  type="button"
                  key={item.place_id}
                  onClick={() => handlePickSuggestion(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    padding: '0.6rem 0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '0.81rem',
                    color: '#1e293b',
                  }}
                >
                  <MapPin size={14} color="#ff6b35" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ lineHeight: 1.35 }}>{formatVietnameseAddress(item) || item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleManualSearch}
          disabled={searching}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '11px',
            padding: '0.52rem 0.9rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Tìm
        </button>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          style={{
            background: '#fff7ed',
            color: '#ea580c',
            border: '1px solid #fdba74',
            borderRadius: '11px',
            padding: '0.52rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          Vị trí của tôi
        </button>
      </div>

      {/* Quick City Shortcuts + Map Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Chuyển nhanh:</span>
          {QUICK_CITIES.map((city) => (
            <button
              key={city.label}
              type="button"
              onClick={() => movePinTo(city.lat, city.lng, { shouldReverse: false, zoom: 13 })}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '8px',
                padding: '2px 9px',
                fontSize: '0.73rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {city.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMapStyle((s) => (s === 'ROAD' ? 'SATELLITE' : 'ROAD'))}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            borderRadius: '8px',
            padding: '3px 9px',
            fontSize: '0.73rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Layers size={13} color="#0284c7" />
          {mapStyle === 'ROAD' ? 'Xem Vệ Tinh' : 'Xem Đường Phố'}
        </button>
      </div>

      {/* Interactive Map Canvas (isolated stacking context so it never overlaps navbar/modals) */}
      <div style={{ position: 'relative', zIndex: 1, isolation: 'isolate', borderRadius: '13px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '275px' }} />
        {resolvingAddress && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 500,
              background: 'rgba(15, 23, 42, 0.88)',
              color: '#ffffff',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Loader2 size={13} /> Đang lấy địa chỉ từ vị trí ghim...
          </div>
        )}
      </div>

      {/* Footer Hint + Google Maps Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.55rem', fontSize: '0.76rem', color: '#475569' }}>
        <span>
          💡 <strong>Mẹo:</strong> Bấm trực tiếp lên bản đồ hoặc kéo thả ghim cam để tự động điền địa chỉ.
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0284c7',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          {hasPicked ? `Google Maps (${pinCoords.lat.toFixed(4)}, ${pinCoords.lng.toFixed(4)})` : 'Mở Google Maps'}
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
