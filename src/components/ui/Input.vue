<template>
  <div class="custom-input">
    <div class="input-container">
      <div class="left-slot">
        <slot name="left">
          <!-- 默认内容，如果没有提供插槽内容则显示 -->
          <span>{{ leftText }}</span>
        </slot>
      </div>
      <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="input-field"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义 props
const props = defineProps({
  leftText: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '300',
  },
});

// 定义 emits
const emit = defineEmits(['input']);

// 计算属性，用于双向绑定
const inputValue = computed({
  get() {
    return props.value;
  },
  set(newValue: string) {
    emit('input', newValue);
  },
});
</script>

<style lang="less" scoped>
.custom-input {
  display: flex;
  align-items: center;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 2px;
  width: 90px;
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
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #ababab;
  width: 23px;
}

.input-field {
  font-size: 12px;
  background-color: #f5f5f5;
  border: none;
  outline: none;
  flex: 1;
  width: 100%;
  &::selection {
    background-color: #0d99ff55;
    color: #000;
  }
}
</style>