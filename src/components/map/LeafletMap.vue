<script setup>
import 'leaflet/dist/leaflet.css'

import { onBeforeUnmount, onMounted, watch, ref } from 'vue'
import { useMarkerToolStore } from '@/stores/markerToolStore'
import { useLineToolStore } from '@/stores/lineToolStore'
import L from 'leaflet'

const props = defineProps({
  selectedMap: String, // Receives selected map type from parent
})

const markerToolStore = useMarkerToolStore()
const lineToolStore = useLineToolStore()

const mapContainer = ref(null) // ref(null) ensures the element is ready after mounting.
let map
let currentLayer
const markers = ref([]) // Store markers
let currentPolyline = null
let currentPolylinePoints = [] // Stores the clicked points

/***
 * TILES
 */
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

/***
 * MAP LAYER OPTIONS
 */
const baseMap = {
  OpenStreetMap: osm,
  'OpenStreetMap HOT': osmHOT,
  'Esri World Imagery': esriWorldImagery,
  'Carto Light': cartoLight,
  'Google Satellite': googleSatellite,
  'Google Hybrid': googleHybrid,
}

/***
 * ON MOUNTED
 */
onMounted(() => {
  // mapContainer.value gives access to the actual DOM element.
  // This avoids issues where Leaflet tries to attach to a null element.
  map = L.map(mapContainer.value, { zoomControl: false }).setView([-8.65842, 115.213969], 13)

  // Default map layer
  const defaultMap = props.selectedMap || 'OpenStreetMap'
  currentLayer = baseMap[defaultMap].addTo(map)

  // Load saved markers from localStorage
  loadMarkersFromStore()

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
  map.on('click', handleMapClick)
  document.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

/***
 * MARKER FUNCTIONS
 */
// handle marker click
const handleMapClick = (e) => {
  if (markerToolStore.isAddingMarker) {
    const newMarker = markerToolStore.addMarker(e.latlng) // Get the returned marker
    addMarker(newMarker) // Add to Leaflet map
  }

  if (lineToolStore.isAddingLine) {
    addPolylinePoint(e.latlng)
  }
}

// Load markers function
const loadMarkersFromStore = () => {
  markerToolStore.markers.forEach((marker) => {
    addMarker(marker)
  })
}

// Add marker
const addMarker = (markerData) => {
  const marker = L.marker(markerData.latlng, { draggable: markerToolStore.isEditingMarker }).addTo(
    map,
  )

  // Enable dragging if isEditingMarker is active
  marker.on('dragend', (event) => {
    console.log(markerToolStore.isEditingMarker)
    const newLatLng = event.target.getLatLng()
    markerToolStore.updateMarker(markerData.id, newLatLng) // Update by ID
    console.log('Marker moved to:', newLatLng)
  })

  // Add event listener to handle marker deletion
  marker.on('click', () => {
    if (markerToolStore.isDeletingMarker) {
      map.removeLayer(marker)
      markerToolStore.removeMarker(markerData.id) // Remove by ID
    }
  })

  markers.value.push({ id: markerData.id, marker })
}

// Watch for editing mode changes
watch(
  () => markerToolStore.isEditingMarker,
  (newEditingState) => {
    markers.value.forEach((markerObj) => {
      const marker = markerObj.marker
      if (marker.dragging) {
        if (newEditingState) {
          marker.dragging.enable()
        } else {
          marker.dragging.disable()
        }
        console.log(`Marker ID ${markerObj.id} dragging: ${marker.dragging._enabled}`)
      } else {
        console.warn('Dragging is not available or not initialized for this marker:', markerObj)
      }
    })
  },
)

// Add polyline points
const addPolylinePoint = (latlng) => {
  currentPolylinePoints.push(latlng)

  if (!currentPolyline) {
    currentPolyline = L.polyline(currentPolylinePoints, { color: 'blue' }).addTo(map)
  } else {
    currentPolyline.setLatLngs(currentPolylinePoints)
  }
}

// Handle Enter key press to finalize polyline
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && lineToolStore.isAddingLine) {
    console.log('Finalizing polyline:', currentPolylinePoints)

    lineToolStore.isAddingLine = false // Stop adding points
    currentPolyline = null
    currentPolylinePoints = []
  }
}

// Watch for isAddingLine changes
watch(
  () => lineToolStore.isAddingLine,
  (isAdding) => {
    if (!isAdding && currentPolyline) {
      currentPolyline = null
      currentPolylinePoints = []
    }
  },
)

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
