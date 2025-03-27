<script setup>
import { ref } from 'vue'
import LeafletMap from '../components/map/LeafletMap.vue'
import MapSwitcher from '../components/map/MapSwitcher.vue'
import Marker from '../components/map/Marker.vue'

const selectedMap = ref('OpenStreetMap') // Default map type
const isAddingMarker = ref(false)
const isDeletingMarker = ref(false)
const isEditingMarker = ref(false)

const updateMap = (newMap) => {
  console.log('Switching to:', newMap)
  selectedMap.value = newMap // Update selected map
}

const toggleAddMarker = (status) => {
  isAddingMarker.value = status
  isDeletingMarker.value = false
  isEditingMarker.value = false
}

const toggleDeleteMarker = (status) => {
  isDeletingMarker.value = status
  isAddingMarker.value = false
  isEditingMarker.value = false
}

const toggleEditMarker = (status) => {
  isEditingMarker.value = status
  isAddingMarker.value = false
  isDeletingMarker.value = false
}
</script>

<template>
  <div class="map-view">
    <Marker
      @toggleAddMarker="toggleAddMarker"
      @toggleDeleteMarker="toggleDeleteMarker"
      @toggleEditMarker="toggleEditMarker"
      class="marker"
    />
    <MapSwitcher @updateMap="updateMap" class="map-switcher" />
    <LeafletMap
      :selectedMap="selectedMap"
      :isAddingMarker="isAddingMarker"
      :isDeletingMarker="isDeletingMarker"
      :isEditingMarker="isEditingMarker"
      ref="mapRef"
      class="map"
    />
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
