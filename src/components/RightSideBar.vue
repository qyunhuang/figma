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
          v-model="inputValue"
          left-text="X"
          placeholder=""
        />
        <Input
          v-model="inputValue"
          left-text="Y"
          placeholder=""
        />
      </div>
      <div class="pb-2 px-4 flex gap-2">
        <Input
          v-model="inputValue"
          left-text="X"
          placeholder=""
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
          v-model="inputValue"
          left-text="W"
          placeholder=""
        />
        <Input
          v-model="inputValue"
          left-text="H"
          placeholder=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from '@/components/ui/Input.vue'
import { RotateCw } from 'lucide-vue-next'

const inputValue = ref('300');
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

