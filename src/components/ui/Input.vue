<template>
  <div class="custom-input">
    <div class="input-container">
      <div class="left-slot">
        <slot name="left">
          <span>{{ leftText }}</span>
        </slot>
      </div>
      <input
        ref="inputRef"
        v-model="inputValue"
        class="input-field"
        @blur="handleConfirm"
        @keydown.enter="handleEnter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: string;
  leftText: string;
  handleChange: (value: string) => void;
}>();

const inputRef = ref<HTMLInputElement | null>(null)

const inputValue = ref(props.value)

watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue
  }
);

const handleConfirm = () => {
  props.handleChange(inputValue.value)
}

const handleEnter = () => {
  handleConfirm()
  if (inputRef.value) {
    inputRef.value.blur()
  }
};
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