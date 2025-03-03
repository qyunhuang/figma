<template>
  <div class="left-side-bar">
    <div class="py-4 px-4 font-medium text-[12px]">
      Layers
    </div>
    <div class="flex flex-col px-4 gap-2">
      <div 
        :class="{'shape-item': true, 'selected': $props.selectedObjectIds.includes(objectId)}"
        v-for="objectId in Object.keys($props.canvasObjects)"
        :key="objectId"
        @click="handleSelectObject(objectId)"
      >
        <div>
          <component 
            :is="getShapeInfo(($props.canvasObjects[objectId] as any).type).icon" 
            :size="12" 
            :stroke-width="1"
            color="#ababab"
          />
        </div>
        <div class="text-[12px]">
          {{ getShapeInfo(($props.canvasObjects[objectId] as any).type).name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, Slash, Circle, Triangle, Type, Spline } from 'lucide-vue-next'

const props = defineProps<{
  canvasObjects: Record<string, Object>;
  selectedObjectIds: string[];
  setSelectedObjectIds: (ids: string[]) => void;
}>()

const handleSelectObject = (objectId: string) => {
  if (props.selectedObjectIds.includes(objectId)) {
    props.setSelectedObjectIds(props.selectedObjectIds.filter((id) => id !== objectId))
  } else {
    props.setSelectedObjectIds([...props.selectedObjectIds, objectId])
  }
}

const getShapeInfo = (shapeType: string) => {
  switch (shapeType) {
    case "rect":
      return {
        icon: Square,
        name: "Rectangle",
      }

    case "line":
      return {
        icon: Slash,
        name: "Line",
      }

    case "ellipse":
      return {
        icon: Circle,
        name: "Ellipse",
      }

    case "triangle":
      return {
        icon: Triangle,
        name: "Triangle",
      }
    
    case "i-text":
      return {
        icon: Type,
        name: "Text",
      }
    
    case "path":
      return {
        icon: Spline,
        name: "Path",
      }

    default:
      return {
        icon: Square,
        name: shapeType,
      }
  }
}
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

