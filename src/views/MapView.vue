<script setup>
import { ref } from 'vue'
import LeafletMap from '../components/map/LeafletMap.vue'
import MapSwitcher from '../components/map/MapSwitcher.vue'
import Marker from '../components/map/Marker.vue'

const selectedMap = ref('OpenStreetMap') // Default map type
const mapRef = ref(null)

const updateMap = (newMap) => {
  console.log('Switching to:', newMap)
  selectedMap.value = newMap // Update selected map
}

const handleToggleAddMarker = (status) => {
  if (mapRef.value) {
    mapRef.value.toggleAddMarker(status)
  }
}
</script>

<template>
  <div class="map-view">
    <Marker @toggleAddMarker="handleToggleAddMarker"  class="marker" />
    <MapSwitcher @updateMap="updateMap" class="map-switcher" />
    <LeafletMap :selectedMap="selectedMap" ref="mapRef" class="map" />
  </div>
</template>

<style scoped>
.map-view {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.map-switcher {
  position: absolute;
  bottom: 20px;
  right: 12px;
  z-index: 1;
}

.map {
  z-index: 0;
}
</style>
