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
        :class="{ cur: tool === 'rectangle' }"
        @click="setTool('rectangle')"
      >
        <Square :size="20" :stroke-width="1" :color="tool === 'rectangle' ? 'white' : 'black'" />
      </div>
      <div>
        <Popover>
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
                v-for="shapeTool in shapeTools" 
                :key="shapeTool.name"
                class="flex items-center"
              >
                <Check :size="12" :stroke-width="1" color="white" />
                <component :is="shapeTool.icon" :size="16" :stroke-width="1" class="ml-1" color="white" />
                <div class="ml-3 text-white text-[13px]">{{ shapeTool.name }}</div>
              </div>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, MousePointer2, ChevronDown, Slash, MoveUpRight, Circle, Triangle, Image, Check } from 'lucide-vue-next'
import Popover from '@/components/Popover.vue'

const tool = ref<'move' | 'rectangle'>('rectangle')
const shapeTools = [
  { icon: Square, name: 'Rectangle' },
  { icon: Slash, name: 'Line' },
  { icon: MoveUpRight, name: 'Arrow' },
  { icon: Circle, name: 'Ellipse' },
  { icon: Triangle, name: 'Polygon' },
  { icon: Image, name: 'Image/video' },
]

function setTool(newTool: 'move' | 'rectangle') {
  tool.value = newTool;
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

</style>

