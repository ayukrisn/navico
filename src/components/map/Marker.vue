<script setup>
import { ref } from 'vue'

const showTools = ref(false)
const isAddingMarker = ref(false)
const emit = defineEmits(['toggleAddMarker'])

const toggleAddMarker = () => {
  isAddingMarker.value = !isAddingMarker.value
  emit('toggleAddMarker', isAddingMarker.value)
}

</script>

<template>
  <div>
    <button class="marker btn" @click="showTools = !showTools">
      <i class="pi pi-map-marker"></i>
    </button>

    <div v-if="showTools" class="marker-tools">
      <button class="add btn" :class="{ active: isAddingMarker }"  @click="toggleAddMarker"><i class="pi pi-plus"></i></button>
      <button class="save btn"><i class="pi pi-bookmark"></i></button>
      <button class="delete btn"><i class="pi pi-trash"></i></button>
      <button class="edit btn"><i class="pi pi-arrows-alt"></i></button>
    </div>
  </div>
</template>

<style scoped>
.marker {
  position: absolute;
  z-index: 1;
  top: 6px;
  left: 6px;
}

.marker-tools {
  display: flex;
  position: absolute;
  gap: 5px;
  position: absolute;
  top: 6px;
  left: 64px;
  z-index: 1;
}
</style>
