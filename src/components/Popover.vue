<template>
  <div class="popover-container">
    <div @click="togglePopover" class="popover-trigger">
      <slot name="trigger" />
    </div>
    <div v-if="isOpen" class="popover-content" ref="popoverContent">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

// 弹出内容的 DOM 引用
const popoverContent = ref<HTMLElement | null>(null)

const togglePopover = () => {
  isOpen.value = !isOpen.value
}

const closePopover = () => {
  isOpen.value = false
}

// 向外部暴露 closePopover 函数
defineExpose({
  closePopover,
})
</script>

<style lang="less" scoped>
.popover-container {
  position: relative;
  display: inline-block;
}

.popover-trigger {
  cursor: pointer;
}

.popover-content {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  z-index: 1000;
  background-color: #1e1e1e;
}
</style>