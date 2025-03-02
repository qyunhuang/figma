<template>
  <div class="custom-multi-input">
    <div class="multi-input-container">
      <div class="left-slot">
        <slot name="left">
          <span>{{ leftText }}</span>
        </slot>
      </div>
      <input
        v-model="inputLeftValue"
        :placeholder="placeholder"
        class="left-input-field"
      />
      <input
        v-model="inputRightValue"
        :placeholder="placeholder"
        class="right-input-field"
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
import { computed } from 'vue';

const props = defineProps<{
  leftValue: string;
  rightValue: string;
  leftText: string;
  rightText: string;
  placeholder: string;
}>();

const emit = defineEmits(['leftInput', 'rightInput']);

const inputLeftValue = computed({
  get() {
    return props.leftValue
  },
  set(newValue: string) {
    emit('leftInput', newValue)
  },
})

const inputRightValue = computed({
  get() {
    return props.rightValue
  },
  set(newValue: string) {
    emit('leftInput', newValue)
  },
})
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
  width: 65%;
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
  width: 25%;
  &::selection {
    background-color: #0d99ff55;
    color: #000;
  }
}
</style>