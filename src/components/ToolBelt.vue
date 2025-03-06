<template>
  <div class="tool-belt">
    <div 
      v-for="(group, index) in optionsRef" 
      :key="group.name"
      class="icon-group"
    >
      <div 
        class="icon-container" 
        :class="{ 'selected-group': curGroupIndex === index }"
        @click="setGroup(index)"
      >
        <component 
          :is="group.options[group.selectedIndex].icon" 
          :size="20" 
          :stroke-width="1" 
          :color="curGroupIndex === index ? 'white' : 'black'" 
        />
      </div>

      <!-- 如果工具组有多个选项，显示下拉箭头 -->
      <div v-if="group.options.length > 1">
        <Popover ref="popoverRefs">
          <template #trigger>
            <div class="select-container" @click="closeOtherPopovers(index)">
              <ChevronDown :size="12" :stroke-width="1" />
            </div>
          </template>
          <template #content>
            <div class="bg-[#1e1e1e]">
              <!-- 遍历工具组的二级选项 -->
              <div 
                v-for="(option, secondIndex) in group.options" 
                :key="option.type"
                class="shape-tool-item"
                @click="setTool(option.type, index, secondIndex)"
              >
                <Check 
                  :size="12" 
                  :stroke-width="1" 
                  color="white" 
                  :style="{ opacity: group.selectedIndex === secondIndex ? 1 : 0 }" 
                />
                <component 
                  :is="option.icon" 
                  :size="16" 
                  :stroke-width="1" 
                  class="ml-1" 
                  color="white" 
                />
                <div class="ml-3 text-white text-[13px]">
                  {{ option.name }}
                </div>
              </div>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square, MousePointer2, ChevronDown, Slash, Circle, Triangle, Check, Type, Hand, Pencil } from 'lucide-vue-next'
import Popover from '@/components/ui/Popover.vue'
import { OptionType } from '@/types/type'

const props = defineProps<{
  selectedToolRef: OptionType,
  setSelectedToolRef: (shape: OptionType) => void
}>()

const popoverRefs = ref<InstanceType<typeof Popover>[]>([])
const curGroupIndex = ref<number>(1)

type GroupName = 'move' | 'shape' | 'creation' | 'text'

interface Option {
  icon: any;
  name: string;
  type: OptionType;
}

interface Group {
  name: GroupName;
  options: Option[];
  selectedIndex: number;
}

const optionsRef = ref<Group[]>([
  {
    name: 'move',
    selectedIndex: 0,
    options: [
      { icon: MousePointer2, name: 'Move', type: 'move' },
      { icon: Hand, name: 'Hand tool', type: 'hand' },
    ],
  },
  {
    name: 'shape',
    selectedIndex: 0,
    options: [
      { icon: Square, name: 'Rectangle', type: 'rect' },
      { icon: Slash, name: 'Line', type: 'line' },
      { icon: Circle, name: 'Ellipse', type: 'ellipse' },
      { icon: Triangle, name: 'Triangle', type: 'triangle' },
    ],
  },
  {
    name: 'creation',
    selectedIndex: 0,
    options: [
      { icon: Pencil, name: 'Pencil', type: 'pencil' },
    ],
  },
  {
    name: 'text',
    selectedIndex: 0,
    options: [
      { icon: Type, name: 'Text', type: 'text' },
    ],
  },
])

function setGroup(index: number) {
  curGroupIndex.value = index
  const curGroup = optionsRef.value[index]
  props.setSelectedToolRef(curGroup.options[curGroup.selectedIndex].type)
}

function setTool(newTool: string, index: number, secondIndex: number) {
  curGroupIndex.value = index
  optionsRef.value[index].selectedIndex = secondIndex
  props.setSelectedToolRef(newTool as OptionType)

  if (popoverRefs.value[index]) {
    popoverRefs.value[index].closePopover()
  }
}

function closeOtherPopovers(index: number) {
  popoverRefs.value.forEach((popover, i) => {
    if (i !== index) {
      popover.closePopover()
    }
  })
}

watch(() => props.selectedToolRef, (newVal) => {
  const groupIndex = optionsRef.value.findIndex((group) => group.options.some((option) => option.type === newVal))
  if (groupIndex !== -1) {
    curGroupIndex.value = groupIndex
    const optionIndex = optionsRef.value[groupIndex].selectedIndex
    const curOptionIndex = optionsRef.value[groupIndex].options.findIndex((option) => option.type === newVal)
    if (optionIndex !== curOptionIndex) {
      optionsRef.value[groupIndex].selectedIndex = curOptionIndex
    }
  }
}, { immediate: true })
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
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  padding: 5px;
  background-color: white;
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

.selected-group {
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
