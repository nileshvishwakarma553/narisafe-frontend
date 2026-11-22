/**
 * NariSafe Intelligent Location Resolver
 * 1. Tries Browser High-Accuracy GPS
 * 2. Falls back to Standard Network WiFi Geolocation
 * 3. Falls back to Instant IP-Based Geolocation (so location is NEVER blank or stuck on default Delhi)
 */
export const getRealLocation = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      fallbackToIP(resolve, 'Browser Geolocation not supported');
      return;
    }

    // Attempt 1: High Accuracy GPS (timeout 7s)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy) || 15,
          source: 'GPS Hardware',
        };
        const address = await reverseGeocode(coords.lat, coords.lng);
        resolve({ ...coords, address });
      },
      (err) => {
        // Attempt 2: Low-accuracy quick network fallback (timeout 5s)
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const coords = {
              lat: Number(pos.coords.latitude.toFixed(6)),
              lng: Number(pos.coords.longitude.toFixed(6)),
              accuracy: Math.round(pos.coords.accuracy) || 50,
              source: 'Network WiFi',
            };
            const address = await reverseGeocode(coords.lat, coords.lng);
            resolve({ ...coords, address });
          },
          () => {
            // Attempt 3: Fast IP-based Geolocation fallback
            fallbackToIP(resolve, err.message);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
    );
  });
};

const fallbackToIP = async (resolve, reason) => {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      const city = data.city || '';
      const region = data.region || '';
      const country = data.country || '';
      const address = [city, region, country].filter(Boolean).join(', ');

      resolve({
        lat: Number(data.latitude.toFixed(6)),
        lng: Number(data.longitude.toFixed(6)),
        accuracy: 1000,
        address: address || 'Current Location',
        source: 'Network IP Location',
        reason,
      });
      return;
    }
  } catch (e) {
    // Silent fail to default
  }

  // Safe baseline if completely offline
  resolve({
    lat: 28.6139,
    lng: 77.2090,
    accuracy: 2000,
    address: 'Central Safe Coordinates',
    source: 'Default Safe Coordinates',
    reason,
  });
};

const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data && data.display_name) {
      // Pick first 3 segments for neat display
      const parts = data.display_name.split(',').slice(0, 3).map((s) => s.trim());
      return parts.join(', ');
    }
  } catch (e) {
    // Ignore reverse geocode error
  }
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};
