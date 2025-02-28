<template>
  <div class="tool-belt">
    <div 
      class="icon-container" 
      :class="{ cur: tool === 'move' }"
      @click="setTool('move')"
    >
      <MousePointer2 :size="20" :stroke-width="1" :color="tool === 'move' ? 'white' : 'black'" />
    </div>
    <div class="icon-group">
      <div 
        class="icon-container" 
        :class="{ cur: tool === 'shape' }"
        @click="setTool('shape')"
      >
        <component :is="shapeToolNameMap[shapeTool]" :size="20" :stroke-width="1" :color="tool === 'shape' ? 'white' : 'black'" />
      </div>
      <div>
        <Popover ref="popoverRef">
          <template #trigger>
            <div
              class="select-container" 
            >
              <ChevronDown :size="12" :stroke-width="1" />
            </div>
          </template>
          <template #content>
            <div class="bg-[#1e1e1e]">
              <div 
                v-for="shapeToolItem in shapeToolItems" 
                :key="shapeToolItem.name"
                class="shape-tool-item"
                @click="setShapeTool(shapeToolItem.name)"
              >
                <Check :size="12" :stroke-width="1" color="white" :style="{opacity: shapeTool === shapeToolItem.name ? 1 : 0}" />
                <component :is="shapeToolItem.icon" :size="16" :stroke-width="1" class="ml-1" color="white" />
                <div class="ml-3 text-white text-[13px]">{{ shapeToolItem.name }}</div>
              </div>
            </div>
          </template>
        </Popover>
      </div>
    </div>
    <div 
      class="icon-container" 
      :class="{ cur: tool === 'creation' }"
      @click="setTool('creation')"
    >
      <PenTool :size="20" :stroke-width="1" :color="tool === 'creation' ? 'white' : 'black'" />
    </div>
    <div 
      class="icon-container" 
      :class="{ cur: tool === 'text' }"
      @click="setTool('text')"
    >
      <Type :size="20" :stroke-width="1" :color="tool === 'text' ? 'white' : 'black'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, MousePointer2, ChevronDown, Slash, MoveUpRight, Circle, Triangle, Image, Check, PenTool, Type } from 'lucide-vue-next'
import Popover from '@/components/Popover.vue'

type Tool = 'move' | 'shape' | 'creation' | 'text'
type ShapeTool = 'Rectangle' | 'Line' | 'Arrow' | 'Ellipse' | 'Polygon' | 'Image/video'

// 获取 Popover 组件的引用
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const tool = ref<Tool>('shape')
const shapeTool = ref<ShapeTool>('Rectangle')
const shapeToolItems: {
  icon: any;
  name: ShapeTool
}[] = [
  { icon: Square, name: 'Rectangle' },
  { icon: Slash, name: 'Line' },
  { icon: MoveUpRight, name: 'Arrow' },
  { icon: Circle, name: 'Ellipse' },
  { icon: Triangle, name: 'Polygon' },
  { icon: Image, name: 'Image/video' },
]
const shapeToolNameMap = {
  Rectangle: Square,
  Line: Slash,
  Arrow: MoveUpRight,
  Ellipse: Circle,
  Polygon: Triangle,
  'Image/video': Image,
}

function setTool(newTool: Tool) {
  tool.value = newTool;
}

function setShapeTool(newShapeTool: ShapeTool) {
  shapeTool.value = newShapeTool
  // 调用暴露的 closePopover 函数
  if (popoverRef.value) {
    console.log(popoverRef.value)
    popoverRef.value.closePopover()
  }
  setTool('shape')
}
</script>

<style lang="less" scoped>
.tool-belt {
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #ddd;
  border-radius: 10px;
  // 阴影
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 5px;
}

.icon-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

.icon-container {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
  &:hover {
    background-color: #eee;
  }
}

.select-container {
  &:extend(.icon-container);
  padding: 2px;
  &:hover {
    background-color: #eee;
  }
}

.cur {
  background-color: #0d99ff;
  &:hover {
    background-color: #0d99ff;
  }
}

.shape-tool-item {
  display: flex;
  align-items: center;
  padding: 2px 4px;
  border-radius: 6px;
  &:hover {
    background-color: #0d99ff;
  }
}

</style>

