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
        Position
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
            <Square :size="12" color="#ababab" fill="#ababab" />
          </template>
        </FillInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import FillInput from '@/components/ui/FillInput.vue'
import { RotateCw, Square } from 'lucide-vue-next'
import { Attributes } from '@/types/type'
import { modifyShape } from '@/lib/shape'

const props = defineProps<{
  fabricRef: fabric.Canvas | null
  elAttrsRef: Attributes;
  setElAttrsRef: (attrs: Attributes) => void;
}>();

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
</style>

