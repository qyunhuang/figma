<template>
  <div class="custom-multi-input">
    <div class="multi-input-container">
      <div class="left-slot">
        <slot name="left">
          <span>{{ leftText }}</span>
        </slot>
      </div>
      <input
        ref="leftInputRef"
        v-model="inputLeftValue"
        class="left-input-field"
        @blur="handleLeftConfirm"
        @keydown.enter="handleLeftEnter"
      />
      <input
        ref="rightInputRef"
        v-model="inputRightValue"
        class="right-input-field"
        @blur="handleRightConfirm"
        @keydown.enter="handleRightEnter"
      />
      <div class="right-slot">
        <slot name="right">
          <span>{{ rightText }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toHexString, toDecimal } from '@/lib/shape'

const props = defineProps<{
  leftValue: string;
  rightValue: string;
  leftText: string;
  rightText: string;
  handleLeftChange: (value: string) => void;
  handleRightChange: (value: string) => void;
}>()

const leftInputRef = ref<HTMLInputElement | null>(null)
const rightInputRef = ref<HTMLInputElement | null>(null)

const inputLeftValue = ref(props.leftValue)
const inputRightValue = ref(props.rightValue)

watch(
  () => props.leftValue,
  (newValue) => {
    inputLeftValue.value = newValue
  }
)

watch(
  () => props.rightValue,
  (newValue) => {
    inputRightValue.value = (newValue)
  }
)

const handleLeftConfirm = () => {
  props.handleLeftChange(toHexString(inputLeftValue.value))
}

const handleRightConfirm = () => {
  props.handleRightChange(toDecimal(inputRightValue.value))
}

const handleLeftEnter = () => {
  handleLeftConfirm()
  if (leftInputRef.value) {
    leftInputRef.value.blur()
  }
}

const handleRightEnter = () => {
  handleRightConfirm()
  if (rightInputRef.value) {
    rightInputRef.value.blur()
  }
}
</script>

<style lang="less" scoped>
.custom-multi-input {
  display: flex;
  align-items: center;
}

.multi-input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 2px;
  width: 150px;
  height: 26px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #e5e5e5;
  }
  &:focus-within {
    border: 1px solid #0d99ff;
  }
}

.left-slot {
  justify-content: center;
  font-size: 12px;
  color: #ababab;
  width: 23px;
  padding-left: 4px;
}

.right-slot {
  justify-content: center;
  font-size: 12px;
  color: #ababab;
  width: 12px;
}

.left-input-field {
  font-size: 12px;
  background-color: #f5f5f5;
  border: none;
  outline: none;
  width: 60%;
  &::selection {
    background-color: #0d99ff55;
    color: #000;
  }
}

.right-input-field {
  font-size: 12px;
  background-color: #f5f5f5;
  border: none;
  outline: none;
  width: 30%;
  &::selection {
    background-color: #0d99ff55;
    color: #000;
  }
}
</style>