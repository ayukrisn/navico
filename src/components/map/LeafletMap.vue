
<script setup>
import 'leaflet/dist/leaflet.css'

import { onMounted, watch, ref, defineProps } from 'vue'
import L from 'leaflet'

const props = defineProps({
  selectedMap: String, // Receives selected map type from parent
})

const mapContainer = ref(null) // ref(null) ensures the element is ready after mounting.
let map
let currentLayer
let isAddingMarker = false
let markers = [] // Store added markers

const toggleAddMarker = (status) => {
  isAddingMarker = status
  if (isAddingMarker) {
    console.log('Add Marker Mode: ON')
  } else {
    console.log('Add Marker Mode: OFF')
  }
}

// the tiles
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
})

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France',
})

var esriWorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
  },
)

var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20,
})

var googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  attribution: '&copy; Google',
})

var googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
  attribution: '&copy; Google',
})

//Map layer options
const baseMap = {
  OpenStreetMap: osm,
  'OpenStreetMap HOT': osmHOT,
  'Esri World Imagery': esriWorldImagery,
  'Carto Light': cartoLight,
  'Google Satellite': googleSatellite,
  'Google Hybrid': googleHybrid,
}

onMounted(() => {
  // mapContainer.value gives access to the actual DOM element.
  // This avoids issues where Leaflet tries to attach to a null element.
  map = L.map(mapContainer.value, { zoomControl: false }).setView([-8.658420, 115.213969], 13)

  // Default map layer
  const defaultMap = props.selectedMap || 'OpenStreetMap'
  currentLayer = baseMap[defaultMap].addTo(map)

  // Custom Zoom Control
  var CustomZoom = L.Control.extend({
    options: {
      position: 'topright', // Position of the control
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'custom-zoom') // Create a div for the buttons

       // Zoom In Button
    let zoomIn = L.DomUtil.create('button', 'btn custom-zoom-in', container)
    zoomIn.innerHTML = '<i class="pi pi-plus"></i>'
    zoomIn.onclick = function (e) {
      e.preventDefault()
      map.zoomIn()
    }

    // Zoom Out Button
    let zoomOut = L.DomUtil.create('button', 'btn custom-zoom-out', container)
    zoomOut.innerHTML = '<i class="pi pi-minus"></i>'
    zoomOut.onclick = function (e) {
      e.preventDefault()
      map.zoomOut()
    }

      // Click Events
      L.DomEvent.on(zoomIn, 'click', function (e) {
        L.DomEvent.stopPropagation(e)
        L.DomEvent.preventDefault(e)
        map.zoomIn()
      })

      L.DomEvent.on(zoomOut, 'click', function (e) {
        L.DomEvent.stopPropagation(e)
        L.DomEvent.preventDefault(e)
        map.zoomOut()
      })

      return container
    },
  })

  // Add Custom Zoom Control to Map
  map.addControl(new CustomZoom())

   // Handle map click event
   map.on('click', (e) => {
    // If adding marker is true, then put marker
    if (isAddingMarker) {
      const { lat, lng } = e.latlng
      const marker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(map)
      markers.push(marker)
      console.log(`Marker added at: ${lat}, ${lng}`)
    }
  })
})

// Watch for map switch updates
watch(
  () => props.selectedMap,
  (newMap) => {
    if (currentLayer) {
      map.removeLayer(currentLayer)
    }
    if (baseMap[newMap]) {
      currentLayer = baseMap[newMap].addTo(map)
    } else {
      console.warn(`Map type "${newMap}" is not found in baseMap`)
    }
  },
)

// Expose toggle function to parent
defineExpose({ toggleAddMarker })
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

/* Custom Zoom Control */
.custom-zoom {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
}
</style>
