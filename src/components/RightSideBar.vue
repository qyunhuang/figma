<template>
  <div class="right-side-bar">
    <div class="block">
      <div class="py-3 px-4 font-medium text-[14px]">
        Rectangle
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px]">
        Position
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <Input
          left-text="X"
          :value="$props.elAttrsRef.left"
          :handle-change="handleChangeLeft"
        />
        <Input
          left-text="Y"
          :value="$props.elAttrsRef.top"
          :handle-change="handleChangeTop"
        />
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <Input
          left-text=""
          :value="$props.elAttrsRef.angle"
          :handle-change="handleChangeAngle"
        >
          <template #left>
            <RotateCw :size="12" color="#ababab" />
          </template>
        </Input>
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px]">
        Layout
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <Input
          left-text="W"
          :value="$props.elAttrsRef.width"
          :handle-change="handleChangeWidth"
        />
        <Input
          left-text="H"
          :value="$props.elAttrsRef.height"
          :handle-change="handleChangeHeight"
        />
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px]">
        Fill
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <FillInput
          left-text=""
          right-text="%"
          :left-value="$props.elAttrsRef.fill"
          :right-value="$props.elAttrsRef.opacity"
          :handle-left-change="handleChangeFill"
          :handle-right-change="handleChangeOpacity"
        >
          <template #left>
            <Square 
              :size="12" 
              :color="getIconColor($props.elAttrsRef.fill)" 
              :fill="getIconColor($props.elAttrsRef.fill)" 
            />
          </template>
        </FillInput>
      </div>
    </div>
    <div class="block">
      <div class="flex justify-between items-center">
        <div class="py-3 px-4 font-medium text-[12px]">
          Stroke
        </div>
        <div class="plus" @click="handleAddStroke">
          <Plus :size="18" color="#000" stroke-width="1" />
        </div>
      </div>
      <div v-if="$props.elAttrsRef.stroke" class="pb-2 px-4 flex gap-2">
        <StrokeInput
          left-text=""
          :value="$props.elAttrsRef.stroke"
          :handle-change="handleChangeStroke"
        >
          <template #left>
            <Square 
              :size="12" 
              :color="getIconColor($props.elAttrsRef.stroke)" 
              :fill="getIconColor($props.elAttrsRef.stroke)"
            />
          </template>
        </StrokeInput>
        <Input
          left-text=""
          :value="$props.elAttrsRef.strokeWidth"
          :handle-change="handleChangeStrokeWidth"
        >
          <template #left>
            <AlignJustify :size="12" color="#ababab" />
          </template>
        </Input>
        <div class="minus" @click="handleRemoveStroke">
          <Minus :size="18" color="#000" stroke-width="1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import FillInput from '@/components/ui/FillInput.vue'
import StrokeInput from './ui/StrokeInput.vue'
import { RotateCw, Square, Plus, AlignJustify, Minus } from 'lucide-vue-next'
import { Attributes } from '@/types/type'
import { modifyShape } from '@/lib/shape'

const props = defineProps<{
  fabricRef: fabric.Canvas | null
  elAttrsRef: Attributes;
  setElAttrsRef: (attrs: Attributes) => void;
}>()

const getIconColor = (color: string) => {
  return color === '' ? '#ababab' : color
}

const handleChangeLeft = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, left: value })
  modifyShape({ canvas: props.fabricRef, property: 'left', value })
}

const handleChangeTop = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, top: value })
  modifyShape({ canvas: props.fabricRef, property: 'top', value })
}

const handleChangeWidth = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, width: value })
  modifyShape({ canvas: props.fabricRef, property: 'width', value })
}

const handleChangeHeight = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, height: value })
  modifyShape({ canvas: props.fabricRef, property: 'height', value })
}

const handleChangeAngle = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, angle: value })
  modifyShape({ canvas: props.fabricRef, property: 'angle', value })
}

const handleChangeFill = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, fill: value })
  modifyShape({ canvas: props.fabricRef, property: 'fill', value })
}

const handleChangeOpacity = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, opacity: value })
  modifyShape({ canvas: props.fabricRef, property: 'opacity', value })
}

const handleAddStroke = () => {
  props.setElAttrsRef({ ...props.elAttrsRef, strokeWidth: '1', stroke: '#000000' })
  modifyShape({ canvas: props.fabricRef, property: 'stroke', value: '#000000' })
  modifyShape({ canvas: props.fabricRef, property: 'strokeWidth', value: '1' })
}

const handleRemoveStroke = () => {
  props.setElAttrsRef({ ...props.elAttrsRef, strokeWidth: '', stroke: '' })
  modifyShape({ canvas: props.fabricRef, property: 'stroke', value: null })
}

const handleChangeStroke = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, stroke: value })
  modifyShape({ canvas: props.fabricRef, property: 'stroke', value })
}

const handleChangeStrokeWidth = (value: string) => {
  props.setElAttrsRef({ ...props.elAttrsRef, strokeWidth: value })
  modifyShape({ canvas: props.fabricRef, property: 'strokeWidth', value })
}

</script>

<style lang="less" scoped>
.right-side-bar {
  width: 250px;
  background-color: #fff;
  border-left: 1px solid #e5e5e5;
}

.block {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 8px;
}

.plus {
  margin-right: 8px;
  padding: 4px;
  border-radius: 4px;
  &:hover {
    background-color: #f5f5f5;
  }
}

.minus {
  margin-left: 4px;
  margin-right: 8px;
  padding: 4px;
  border-radius: 4px;
  &:hover {
    background-color: #f5f5f5;
  }
}
</style>

