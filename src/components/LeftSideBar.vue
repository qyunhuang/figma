<template>
  <div class="left-side-bar">
    <div class="pt-4 pb-2 px-4 font-medium text-[12px]">
      Layers
    </div>
    <div class="flex flex-col px-3">
      <LayerItem
        v-for="objectId in Object.keys($props.canvasObjects)"
        :key="objectId"
        :object="$props.canvasObjects[objectId]"
        :selected-object-ids="$props.selectedObjectIds"
        :set-selected-object-ids="$props.setSelectedObjectIds"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LayerItem from './ui/LayerItem.vue';

defineProps<{
  canvasObjects: Record<string, Object>;
  selectedObjectIds: string[];
  setSelectedObjectIds: (ids: string[]) => void;
}>()
</script>

<style lang="less" scoped>
.left-side-bar {
  background-color: white;
  width: 250px;
}

.shape-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  border-radius: 6px;

  &:hover {
    background-color: #f5f5f5;
  }

  &.selected {
    background-color: #e5f4ff;
  }
}
</style>

