<template>
  <div class="right-side-bar">
    <!-- <div class="block">
      <div class="py-3 px-4 font-medium text-[14px]">
        Rectangle
      </div>
    </div> -->
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px] position-block">
        Position
      </div>
      <div v-if="$props.elAttrs.left" class="pb-2 px-4 flex gap-2">
        <Input
          left-text="X"
          :value="$props.elAttrs.left"
          :handle-change="handleChangeLeft"
        />
        <Input
          left-text="Y"
          :value="$props.elAttrs.top"
          :handle-change="handleChangeTop"
        />
      </div>
      <div v-if="$props.elAttrs.left" class="pb-2 px-4 flex gap-2">
        <Input
          left-text=""
          :value="$props.elAttrs.angle"
          :handle-change="handleChangeAngle"
        >
          <template #left>
            <RotateCw :size="12" color="#ababab" />
          </template>
        </Input>
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px] layout-block">
        Layout
      </div>
      <div v-if="$props.elAttrs.width" class="pb-2 px-4 flex gap-2">
        <Input
          left-text="W"
          :value="$props.elAttrs.width"
          :handle-change="handleChangeWidth"
        />
        <Input
          left-text="H"
          :value="$props.elAttrs.height"
          :handle-change="handleChangeHeight"
        />
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px] typography-block">
        Typography
      </div>
      <div v-if="$props.elAttrs.fontWeight" class="pb-2 px-4 flex gap-2">
        <div>
          <Select
            :value="$props.elAttrs.fontWeight"
            :options="fontWeightOptions"
            :handle-change="handleChangeFontWeight"
          />
        </div>
        <div>
          <Select
            :value="$props.elAttrs.fontSize"
            :options="fontSizeOptions"
            :handle-change="handleChangeFontSize"
          />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px] fill-block">
        Fill
      </div>
      <div v-if="$props.elAttrs.fill" class="pb-2 px-4 flex gap-2">
        <FillInput
          left-text=""
          right-text="%"
          :left-value="$props.elAttrs.fill"
          :right-value="$props.elAttrs.opacity"
          :handle-left-change="handleChangeFill"
          :handle-right-change="handleChangeOpacity"
        >
          <template #left>
            <Square 
              :size="12" 
              :color="getIconColor($props.elAttrs.fill)" 
              :fill="getIconColor($props.elAttrs.fill)" 
            />
          </template>
        </FillInput>
      </div>
    </div>
    <div class="block">
      <div class="flex justify-between items-center">
        <div class="py-3 px-4 font-medium text-[12px] stroke-block">
          Stroke
        </div>
        <div v-if="$props.elAttrs.fill" class="plus" @click="handleAddStroke">
          <Plus :size="18" :color="strokeBlockColor" stroke-width="1" />
        </div>
      </div>
      <div v-if="$props.elAttrs.stroke" class="pb-2 px-4 flex gap-2">
        <StrokeInput
          left-text=""
          :value="$props.elAttrs.stroke"
          :handle-change="handleChangeStroke"
        >
          <template #left>
            <Square 
              :size="12" 
              :color="getIconColor($props.elAttrs.stroke)" 
              :fill="getIconColor($props.elAttrs.stroke)"
            />
          </template>
        </StrokeInput>
        <Input
          left-text=""
          :value="$props.elAttrs.strokeWidth"
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
import Select from './ui/Select.vue'
import { RotateCw, Square, Plus, AlignJustify, Minus } from 'lucide-vue-next'
import { Attributes } from '@/types/type'
import { modifyShape } from '@/lib/shape'
import { fontWeightOptions, fontSizeOptions } from '@/constants'

const props = defineProps<{
  fabric: fabric.Canvas | null
  elAttrs: Attributes;
  setElAttrs: (attrs: Attributes) => void;
  syncShapeInStorage: (object: fabric.Object) => void;
}>()

const getIconColor = (color: string) => {
  return (color === '' || color === 'Mixed') ? '#ababab' : color
}

const strokeBlockColor = computed(() => {
  return props.elAttrs.stroke ? '#000' : '#ababab'
})

const typographyBlockColor = computed(() => {
  return props.elAttrs.fontWeight ? '#000' : '#ababab'
})

const positionBlockColor = computed(() => {
  return props.elAttrs.left ? '#000' : '#ababab'
})

const layoutBlockColor = computed(() => {
  return props.elAttrs.width ? '#000' : '#ababab'
})

const fillBlockColor = computed(() => {
  return props.elAttrs.fill ? '#000' : '#ababab'
})

const handleModifyShape = ({
  property,
  value,
}: {
  property: string;
  value: string | null;
}) => {
  modifyShape({ canvas: props.fabric, property, value, syncShapeInStorage: props.syncShapeInStorage })
}

const handleChangeLeft = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, left: value })
  handleModifyShape({ property: 'left', value })
}

const handleChangeTop = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, top: value })
  handleModifyShape({ property: 'top', value })
}

const handleChangeWidth = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, width: value })
  handleModifyShape({ property: 'width', value })
}

const handleChangeHeight = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, height: value })
  handleModifyShape({ property: 'height', value })
}

const handleChangeAngle = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, angle: value })
  handleModifyShape({ property: 'angle', value })
}

const handleChangeFill = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, fill: value })
  handleModifyShape({ property: 'fill', value })
}

const handleChangeOpacity = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, opacity: value })
  handleModifyShape({ property: 'opacity', value })
}

const handleAddStroke = () => {
  props.setElAttrs({ ...props.elAttrs, strokeWidth: '1', stroke: '#000000' })
  handleModifyShape({ property: 'stroke', value: '#000000' })
  handleModifyShape({ property: 'strokeWidth', value: '1' })
}

const handleRemoveStroke = () => {
  props.setElAttrs({ ...props.elAttrs, strokeWidth: '', stroke: '' })
  handleModifyShape({ property: 'stroke', value: null })
}

const handleChangeStroke = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, stroke: value })
  handleModifyShape({ property: 'stroke', value })
}

const handleChangeStrokeWidth = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, strokeWidth: value })
  handleModifyShape({ property: 'strokeWidth', value })
}

const handleChangeFontWeight = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, fontWeight: value })
  handleModifyShape({ property: 'fontWeight', value })
}

const handleChangeFontSize = (value: string) => {
  props.setElAttrs({ ...props.elAttrs, fontSize: value })
  handleModifyShape({ property: 'fontSize', value })
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

.stroke-block {
  color: v-bind(strokeBlockColor);
}

.typography-block {
  color: v-bind(typographyBlockColor);
}

.position-block {
  color: v-bind(positionBlockColor);
}

.layout-block {
  color: v-bind(layoutBlockColor);
}

.fill-block {
  color: v-bind(fillBlockColor);
}
</style>

