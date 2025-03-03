<template>
  <div class="left-side-bar">
    <div class="py-4 px-4 font-medium text-[12px]">
      Layers
    </div>
    <div class="flex flex-col px-4 gap-2">
      <div class="flex items-center gap-2" v-for="objectId in Object.keys($props.canvasObjects)">
        <div>
          <component 
            :is="getShapeInfo(($props.canvasObjects[objectId] as any).type).icon" 
            :size="12" 
            :stroke-width="1"
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

defineProps<{
  canvasObjects: Record<string, Object>;
}>()

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
    
    case "text":
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
</style>

