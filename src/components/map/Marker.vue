<script setup>
import { ref } from 'vue'

const showTools = ref(false)
const emit = defineEmits(['toggleAddMarker', 'toggleDeleteMarker', 'toggleEditMarker'])

const isAddingMarker = ref(false)
const isDeletingMarker = ref(false)
const isEditingMarker = ref(false)

const toggleAddMarker = () => {
  isAddingMarker.value = !isAddingMarker.value
  isDeletingMarker.value = false
  isEditingMarker.value = false
  emit('toggleAddMarker', isAddingMarker.value)
}

const toggleDeleteMarker = () => {
  isDeletingMarker.value = !isDeletingMarker.value
  isAddingMarker.value = false
  isEditingMarker.value = false
  emit('toggleDeleteMarker', isDeletingMarker.value)
}

const toggleEditMarker = () => {
  isEditingMarker.value = !isEditingMarker.value
  isAddingMarker.value = false
  isDeletingMarker.value = false
  emit('toggleEditMarker', isEditingMarker.value)
}

</script>

<template>
  <div>
    <button class="marker btn" :class="{ active: showTools }" @click="showTools = !showTools">
      <i class="pi pi-map-marker"></i>
    </button>

    <div v-if="showTools" class="marker-tools">
      <button class="add btn" :class="{ active: isAddingMarker }"  @click="toggleAddMarker"><i class="pi pi-plus"></i></button>
      <button class="save btn"><i class="pi pi-bookmark"></i></button>
      <button class="delete btn" :class="{ active: isDeletingMarker }"  @click="toggleDeleteMarker"><i class="pi pi-trash"></i></button>
      <button class="edit btn" :class="{ active: isEditingMarker }" @click="toggleEditMarker"><i class="pi pi-arrows-alt"></i></button>
    </div>
  </div>
</template>

<style scoped>
.active {
  background-color: #006A71;; /* Green when active */
  color: white;
}


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
