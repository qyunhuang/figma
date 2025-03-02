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
          placeholder=""
          :value="$props.elAttrsRef.left"
        />
        <Input
          left-text="Y"
          placeholder=""
          :value="$props.elAttrsRef.top"
        />
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <Input
          left-text=""
          placeholder=""
          :value="$props.elAttrsRef.angle"
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
          placeholder=""
          :value="$props.elAttrsRef.width"
        />
        <Input
          left-text="H"
          placeholder=""
          :value="$props.elAttrsRef.height"
        />
      </div>
    </div>
    <div class="block">
      <div class="py-3 px-4 font-medium text-[12px]">
        Fill
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <MultiInput
          left-text=""
          right-text="%"
          placeholder=""
          :left-value="$props.elAttrsRef.fill"
          :right-value="$props.elAttrsRef.opacity"
        >
          <template #left>
            <Square :size="12" color="#ababab" fill="#ababab" />
          </template>
        </MultiInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import MultiInput from '@/components/ui/MultiInput.vue'
import { RotateCw, Square } from 'lucide-vue-next'
import { Attributes } from '@/types/type'

defineProps<{
  elAttrsRef: Attributes;
  setElAttrsRef: (attrs: Attributes) => void;
}>();

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

