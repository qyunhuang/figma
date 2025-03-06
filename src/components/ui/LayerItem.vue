<template>
  <div>
    <div 
      class="shape-item"
    >
      <div
        @click.stop="toggleExpand"
      >
        <ChevronRight 
          :size="12" 
          :class="{ 'rotated': isExpanded }"
          :color="$props.object.type === 'group' ? '#ababab' : '#fff0'"
        />
      </div>
      <div>
        <component 
          :is="getShapeInfo(object.type).icon" 
          :size="12" 
          :stroke-width="2"
          :color="getIconColor"
        />
      </div>
      <div class="text-[12px] flex-1">
        {{ getShapeInfo(object.type).name }}
      </div>
    </div>
    <div v-if="object.type === 'group' && isExpanded" class="nested-items">
      <LayerItem
        v-for="subObject in object.objects"
        :key="subObject.objectId"
        :object="subObject"
        :selected-object-ids="selectedObjectIds"
        :grouped="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, Slash, Circle, Triangle, Type, Spline, SquareDashed, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  object: any;
  selectedObjectIds: string[];
  grouped: boolean;
}>()

const isExpanded = ref(false)

const isSelected = computed(() => 
  props.selectedObjectIds.includes(props.object.objectId)
)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const getIconColor = computed(() => {
  return isSelected.value ? '#000' : '#ababab'
})

const getShapeInfo = (shapeType: string) => {
  switch (shapeType) {
    case "rect": return { icon: Square, name: "Rectangle" }
    case "line": return { icon: Slash, name: "Line" }
    case "ellipse": return { icon: Circle, name: "Ellipse" }
    case "triangle": return { icon: Triangle, name: "Triangle" }
    case "i-text": return { icon: Type, name: "Text" }
    case "path": return { icon: Spline, name: "Path" }
    case "group": return { icon: SquareDashed, name: "Group" }
    default: return { icon: Square, name: shapeType }
  }
}
</script>

<style lang="less" scoped>
.shape-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  cursor: default;
}

.nested-items {
  padding-left: 20px;
}
.rotated {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}
</style>