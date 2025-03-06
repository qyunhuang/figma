<template>
  <div class="left-side-bar">
    <div class="pt-4 pb-2 px-4 font-medium text-[12px]">
      Layers
    </div>
    <div class="flex flex-col px-3">
      <LayerItem
        v-for="objectId in Object.keys($props.canvasObjects)"
        :key="objectId"
        :fabric="$props.fabric" 
        :object="$props.canvasObjects[objectId]"
        :selected-object-ids="$props.selectedObjectIds"
        :class="[{ 'selected': selectedObjectIds.includes(objectId) }, 'layer-item']"
        :grouped="false"
        :visibility="$props.canvasObjects[objectId].visible"
        @click="handleItemClick(objectId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LayerItem from './ui/LayerItem.vue';

const props = defineProps<{
  fabric: fabric.Canvas | null;
  canvasObjects: Record<string, any>;
  selectedObjectIds: string[];
  setSelectedObjectIds: (ids: string[]) => void;
}>()

const handleItemClick = (objectId: string) => {
  props.setSelectedObjectIds([objectId])
}
</script>

<style lang="less" scoped>
.left-side-bar {
  background-color: white;
  width: 250px;
}

.layer-item {
  border-radius: 6px;
  margin-top: 8px;

  &:hover {
    background-color: #f5f5f5;
  }
}

.selected {
  background-color: #e5f4ff;

  &:hover {
    background-color: #e5f4ff;
  }
}
</style>

