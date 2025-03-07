<template>
  <div>
    <div 
      class="shape-item"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
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
      <div class="type-text">
        {{ getShapeInfo(object.type).name }}
      </div>
      <div class="flex gap-3">
        <component 
          :style="{ visibility: showSelectablility ? 'visible' : 'hidden' }"
          :is="$props.selectablility ? LockOpen : Lock" 
          :size="12" 
          :stroke-width="2"
          @click.stop="handleChangeSelectablility(object.objectId)"
        />
        <component 
          :style="{ visibility: showVisibility ? 'visible' : 'hidden' }"
          :is="$props.visibility ? Eye : EyeClosed" 
          :size="12" 
          :stroke-width="2"
          @click.stop="handleChangeVisibility(object.objectId)"
        />
      </div>
    </div>
    <div v-if="object.type === 'group' && isExpanded" class="nested-items">
      <LayerItem
        v-for="subObject in object.objects"
        :key="subObject.objectId"
        :object="subObject"
        :fabric="fabric"
        :selected-object-ids="selectedObjectIds"
        :grouped="true"
        :visibility="object.visible"
        :selectablility="object.selectable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Square, 
  Slash, 
  Circle, 
  Triangle, 
  Type, 
  Spline, 
  SquareDashed, 
  ChevronRight, 
  Eye, 
  EyeClosed,
  Lock,
  LockOpen,
} from 'lucide-vue-next'
import { modifyVisibility, modifySelectablility } from '@/lib/shape'

import { useStore } from '@/stores'

const store = useStore()

const props = defineProps<{
  fabric: fabric.Canvas | null;
  object: any;
  selectedObjectIds: string[];
  grouped: boolean;
  visibility: boolean;
  selectablility: boolean;
}>()

const isExpanded = ref(false)
const isHovered = ref(false)

const showVisibility = computed(() => 
  !props.grouped && (isHovered.value || !props.visibility)
)

const showSelectablility = computed(() => 
  !props.grouped && (isHovered.value || !props.selectablility)
)

const isSelected = computed(() => 
  props.selectedObjectIds.includes(props.object.objectId)
)

const textColor = computed(() => 
  props.visibility ? '#000' : '#ababab'
)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleChangeVisibility = (objectId: string) => {
  props.object.visible = !props.object.visible
  modifyVisibility({ canvas: props.fabric, objectId })
  store.modifyShapeInStorage(objectId, 'visible', props.object.visible)
}

const handleChangeSelectablility = (objectId: string) => {
  props.object.selectable = !props.object.selectable
  modifySelectablility({ canvas: props.fabric, objectId })
  store.modifyShapeInStorage(objectId, 'selectable', props.object.selectable)
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

<style lang="less
" scoped>
.shape-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  cursor: default;
}

.nested-items {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.rotated {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.type-text {
  font-size: 12px;
  flex: 1;
  color: v-bind(textColor);
}
</style>