// 1. DATA: 20 Nagpur Properties
const props = [
    { id: 1, name: "Civil Lines Heights", price: "₹25,000", lat: 21.152, lng: 79.070, orientation: 90 },  // East
    { id: 2, name: "Dharampeth Residency", price: "₹18,500", lat: 21.140, lng: 79.065, orientation: 270 }, // West
    { id: 3, name: "Ramdaspeth Premium", price: "₹32,000", lat: 21.135, lng: 79.075, orientation: 180 },   // South
    { id: 4, name: "Sitabuldi Square Lofts", price: "₹15,000", lat: 21.145, lng: 79.085, orientation: 0 },     // North
    { id: 5, name: "Manish Nagar Studio", price: "₹12,000", lat: 21.095, lng: 79.090, orientation: 90 },    // East
    { id: 6, name: "Pratap Nagar Apts", price: "₹22,500", lat: 21.120, lng: 79.055, orientation: 270 },   // West
    { id: 7, name: "MIHAN Tech Park Stay", price: "₹20,000", lat: 21.060, lng: 79.050, orientation: 90 },   // East
    { id: 8, name: "Trimurti Nagar Flat", price: "₹16,000", lat: 21.115, lng: 79.045, orientation: 180 },   // South
    { id: 9, name: "Khamla Square Greens", price: "₹19,000", lat: 21.110, lng: 79.060, orientation: 270 },  // West
    { id: 10, name: "Jaripatka Heritage", price: "₹14,500", lat: 21.185, lng: 79.095, orientation: 0 },    // North
    { id: 11, name: "Besa Road Gardens", price: "₹11,000", lat: 21.080, lng: 79.105, orientation: 90 },   // East
    { id: 12, name: "Friends Colony West", price: "₹17,000", lat: 21.165, lng: 79.040, orientation: 270 },  // West
    { id: 13, name: "Wardhaman Nagar East", price: "₹21,000", lat: 21.155, lng: 79.130, orientation: 90 },  // East
    { id: 14, name: "Ayodhya Nagar Hub", price: "₹13,500", lat: 21.125, lng: 79.115, orientation: 180 },  // South
    { id: 15, name: "Koradi Road View", price: "₹15,500", lat: 21.210, lng: 79.085, orientation: 0 },     // North
    { id: 16, name: "Sonegaon Skybox", price: "₹28,000", lat: 21.100, lng: 79.045, orientation: 270 },  // West
    { id: 17, name: "Wadi Industrial Lofts", price: "₹10,500", lat: 21.150, lng: 79.005, orientation: 90 }, // East
    { id: 18, name: "Medical Square Plaza", price: "₹16,500", lat: 21.130, lng: 79.095, orientation: 180 }, // South
    { id: 19, name: "Pardi East Point", price: "₹9,500", lat: 21.160, lng: 79.155, orientation: 90 },    // East
    { id: 20, name: "Beltarodi New City", price: "₹18,000", lat: 21.070, lng: 79.095, orientation: 270 }   // West
];

// 2. Initialize Map
const map = L.map('map', { zoomControl: false }).setView([21.1458, 79.0882], 13);
const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: 'CartoDB' });
const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OSM' });
darkTiles.addTo(map);

const workplaceIcon = L.divIcon({
    className: 'workplace-marker',
    html: "<div style='background:#6366f1; width:14px; height:14px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px #6366f1;'></div>",
    iconSize: [20, 20], iconAnchor: [10, 10]
});

const workplace = L.marker([21.1458, 79.0882], { icon: workplaceIcon, draggable: true }).addTo(map);
const reachCircle = L.circle([21.1458, 79.0882], { color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1.5, dashArray: '5, 5' }).addTo(map);
const markersLayer = L.layerGroup().addTo(map);

// 3. Theme Toggle
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);

    if (newTheme === 'light') {
        map.removeLayer(darkTiles); lightTiles.addTo(map);
        document.getElementById('themeIconBtn').innerHTML = '<i data-lucide="moon"></i>';
    } else {
        map.removeLayer(lightTiles); darkTiles.addTo(map);
        document.getElementById('themeIconBtn').innerHTML = '<i data-lucide="sun"></i>';
    }
    lucide.createIcons();
}

// 4. Search & Autocomplete
const searchInput = document.getElementById('addressSearch');
const clearBtn = document.getElementById('clearSearch');
const suggestionsBox = document.getElementById('suggestions');
let debounceTimer;

searchInput.addEventListener('input', function () {
    const query = this.value;
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    if (query.length < 3) { suggestionsBox.classList.add('hidden'); return; }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetch`(https://nominatim.openstreetmap.org/search?format=json&q=${query}+Nagpur&limit=5)`
            .then(res => res.json()).then(data => renderSuggestions(data));
    }, 300);
});

function renderSuggestions(data) {
    suggestionsBox.innerHTML = '';
    if (data.length === 0) { suggestionsBox.classList.add('hidden'); return; }
    data.forEach(place => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        const name = place.display_name.split(',')[0];
        div.innerText = name;
        div.onclick = () => {
            const latlng = [place.lat, place.lon];
            workplace.setLatLng(latlng);
            map.flyTo(latlng, 14);
            searchInput.value = name;
            suggestionsBox.classList.add('hidden');
            updateUI();
        };
        suggestionsBox.appendChild(div);
    });
    suggestionsBox.classList.remove('hidden');
}

clearBtn.onclick = () => {
    searchInput.value = ''; clearBtn.style.display = 'none';
    const home = [21.1458, 79.0882];
    workplace.setLatLng(home); map.flyTo(home, 13);
    updateUI();
};

// 5. Details Sidebar Functions
function showDetails(id, time) {
    const p = props.find(x => x.id === id);
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerText = p.price;
    document.getElementById('detTime').innerText = `${time} mins`;
    document.getElementById('detailsSidebar').classList.remove('hidden');
    map.flyTo([p.lat, p.lng], 15);
}

function closeDetails() {
    document.getElementById('detailsSidebar').classList.add('hidden');
}

// 6. GIS Update Engine
function updateUI() {
    const mins = document.getElementById('commuteSlider').value;
    document.getElementById('timeVal').innerText = `${mins} mins`;
    const radius = mins * 220;

    reachCircle.setRadius(radius);
    reachCircle.setLatLng(workplace.getLatLng());
    markersLayer.clearLayers();

    const list = document.getElementById('resultsList');
    list.innerHTML = '';
    let count = 0;

    props.forEach(p => {
        const dist = workplace.getLatLng().distanceTo([p.lat, p.lng]);
        if (dist <= radius) {
            count++;
            const travelTime = Math.round(dist / 220);

            // Add Map Marker
            L.circleMarker([p.lat, p.lng], { radius: 7, color: '#6366f1', fillColor: '#fff', fillOpacity: 1, weight: 2 })
                .addTo(markersLayer).on('click', () => showDetails(p.id, travelTime));

            // Add List Card
            const card = document.createElement('div');
            card.className = 'prop-card';
            card.onclick = () => showDetails(p.id, travelTime);
            card.innerHTML = `<h4>${p.name}</h4><div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="price">${p.price}</span><small>🕒 ${travelTime} min</small></div>`;
            list.appendChild(card);
        }
    });
    document.getElementById('count').innerText = count;
}

// Global State for Transport
let currentSpeed = 400; // Default: Driving (meters/min)
let currentModeColor = '#6366f1';

function setMode(mode, speed, color) {
    currentSpeed = speed;
    currentModeColor = color;

    // Update UI Button States
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(btn-`${mode}`).classList.add('active');

    // Update Circle Visuals
    reachCircle.setStyle({
        color: color,
        fillColor: color
    });

    // Update the Map Logic
    updateUI();
}

// MODIFIED updateUI Logic
function updateUI() {
    const mins = document.getElementById('commuteSlider').value;
    document.getElementById('timeVal').innerText = `${mins} mins`;
    const radius = mins * currentSpeed;

    reachCircle.setRadius(radius);
    reachCircle.setLatLng(workplace.getLatLng());
    markersLayer.clearLayers();

    const list = document.getElementById('resultsList');
    list.innerHTML = '';
    
    // 1. First, find all properties in range to calculate Averages
    const filteredProps = props.filter(p => {
        const dist = workplace.getLatLng().distanceTo([p.lat, p.lng]);
        return dist <= radius;
    });

    const avgPrice = filteredProps.reduce((sum, p) => sum + parseInt(p.price.replace(/[₹,]/g, '')), 0) / filteredProps.length;
    const avgTime = filteredProps.reduce((sum, p) => {
        const dist = workplace.getLatLng().distanceTo([p.lat, p.lng]);
        return sum + Math.round(dist / currentSpeed);
    }, 0) / filteredProps.length;

    document.getElementById('count').innerText = filteredProps.length;

    // 2. Loop through filtered props to build UI
    filteredProps.forEach(p => {
        const dist = workplace.getLatLng().distanceTo([p.lat, p.lng]);
        const travelTime = Math.round(dist / currentSpeed);
        const priceNum = parseInt(p.price.replace(/[₹,]/g, ''));

        // Logic for Value Badge
        let valueClass = 'value-fair';
        let valueLabel = 'Fair Value';
        if (priceNum < avgPrice && travelTime < avgTime) {
            valueClass = 'value-deal';
            valueLabel = 'Great Deal';
        } else if (priceNum > avgPrice && travelTime > avgTime) {
            valueClass = 'value-poor';
            valueLabel = 'Premium Location';
        }

        // Calculate "Price per Minute" saved vs. Average
        const priceDiff = Math.abs(Math.round(priceNum - avgPrice));
        const timeDiff = Math.abs(Math.round(travelTime - avgTime));
        const tradeOffMsg = priceNum < avgPrice 
            ? `Save <b>₹${priceDiff}</b> vs average, but adds <b>${timeDiff}m</b> commute.`
            : `Pay <b>₹${priceDiff}</b> extra for <b>${timeDiff}m</b> faster commute.`;

        // Create Marker
        L.circleMarker([p.lat, p.lng], { radius: 7, color: currentModeColor, fillColor: '#fff', fillOpacity: 1, weight: 2 })
            .addTo(markersLayer).on('click', () => showDetails(p.id, travelTime));

        // Create Card
        const card = document.createElement('div');
        card.className = 'prop-card';
        card.onclick = () => showDetails(p.id, travelTime);
        card.innerHTML = `
            <span class="value-badge ${valueClass}">${valueLabel}</span>
            <h4>${p.name}</h4>
            <div style="display:flex; justify-content:space-between;">
                <span class="price" style="color:${currentModeColor}">${p.price}</span>
                <small>🕒 ${travelTime} min</small>
            </div>
            <div class="trade-off-text">${tradeOffMsg}</div>
        `;
        list.appendChild(card);
    });
}

function updateSunlight() {
    const hour = document.getElementById('sunSlider').value;
    const timeText = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    document.getElementById('sunTimeText').innerText = hour == 12 ? "12 PM" : timeText;

    // The "Sun Angle" logic (Roughly: East in morning, West in evening)
    // 6 AM = 90 deg (East), 12 PM = 180 (Overhead), 6 PM = 270 (West)
    const sunPos = (hour * 15); 

    markersLayer.eachLayer((marker) => {
        // Find the property data for this marker
        const prop = props.find(p => p.lat === marker.getLatLng().lat);
        if (!prop) return;

        // Calculate if the sun is hitting the "face" of the building
        const diff = Math.abs(prop.orientation - sunPos);
        
        if (diff < 45) {
            // Direct Sunlight
            marker.setStyle({ color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.9 });
            marker.getElement().classList.add('sun-glow');
        } else if (diff > 135) {
            // Full Shade
            marker.setStyle({ color: '#6366f1', fillColor: '#1e293b', fillOpacity: 0.6 });
            marker.getElement().classList.remove('sun-glow');
        } else {
            // Partial Light
            marker.setStyle({ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.4 });
            marker.getElement().classList.remove('sun-glow');
        }
    });
}

// Listeners
document.getElementById('commuteSlider').addEventListener('input', updateUI);
workplace.on('drag', updateUI);
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) suggestionsBox.classList.add('hidden');
});

// Final Init
lucide.createIcons();
updateUI();

// POI Storage Layers
const poiLayers = {
    hospital: L.layerGroup().addTo(map),
    subway: L.layerGroup().addTo(map),
    shopping_cart: L.layerGroup().addTo(map)
};

// Colors for POI markers
const poiColors = {
    hospital: "#ef4444",    // Red
    subway: "#eab308",      // Gold
    shopping_cart: "#8b5cf6" // Purple
};

let safetyCircle = null;
let currentSelectedProp = null;

// Modify your existing showDetails function to trigger safety calc
function showDetails(id, time) {
    const p = props.find(x => x.id === id);
    currentSelectedProp = p; // Store for safety toggle
    
    document.getElementById('detName').innerText = p.name;
    document.getElementById('detPrice').innerText = p.price;
    document.getElementById('detTime').innerText = `${time} mins`;
    document.getElementById('detailsSidebar').classList.remove('hidden');
    
    // Calculate Safety Score based on nearby props/POIs
    calculateSafetyScore(p);
    
    map.flyTo([p.lat, p.lng], 15);
}

function calculateSafetyScore(prop) {
    // Logic: Count how many other properties or POIs are within 500m
    // More "Active neighbors" = Higher safety score
    let activePoints = 0;
    props.forEach(other => {
        const d = L.latLng(prop.lat, prop.lng).distanceTo([other.lat, other.lng]);
        if (d < 500 && d > 0) activePoints++;
    });

    // Scale score: 0-5 points = Low, 5-10 = Med, 10+ = High
    const score = Math.min(activePoints * 10, 100);
    const fill = document.getElementById('safetyFill');
    const label = document.getElementById('safetyLabel');
    
    fill.style.width = score + '%';
    label.innerText = score > 70 ? 'Very Safe' : (score > 40 ? 'Moderate' : 'Quiet Zone');
}

function toggleSafetyZone() {
    if (safetyCircle) {
        map.removeLayer(safetyCircle);
        safetyCircle = null;
        return;
    }

    if (!currentSelectedProp) return;

    // Draw 500m "Walking Safety" isochrone
    safetyCircle = L.circle([currentSelectedProp.lat, currentSelectedProp.lng], {
        radius: 500,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.15,
        weight: 2,
        className: 'safety-pulse'
    }).addTo(map);
    
    // Add a popup explaining the zone
    safetyCircle.bindPopup("<b>5-Minute Walking Safety Zone</b><br>High foot-traffic & well-lit area.").openPopup();
}

async function togglePOI(type, checkbox) {
    if (!checkbox.checked) {
        poiLayers[type].clearLayers();
        return;
    }

    // Overpass API Query for Nagpur
    // amenity=hospital, station=subway, shop=supermarket
    const category = type === 'subway' ? 'station=subway' : 
                     type === 'hospital' ? 'amenity=hospital' : 'shop=supermarket';
    
    const bounds = map.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    
    const query = `[out:json];node[${category}](${bbox});out;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        data.elements.forEach(el => {
            L.circleMarker([el.lat, el.lon], {
                radius: 5,
                color: poiColors[type],
                fillOpacity: 0.8,
                weight: 1
            })
            .bindPopup(<b>${el.tags.name || "Unnamed Point"}</b>)
            .addTo(poiLayers[type]);
        });
    } catch (err) {
        console.error("POI Fetch Error:", err);
    }
}