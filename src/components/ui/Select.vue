<template>
  <div class="custom-select">
    <div class="select-container" @click="toggleDropdown">
      <div class="selected-option">
        <span>{{ selectedOption }}</span>
      </div>
      <div class="arrow-icon">
        <ChevronDown :size="12" :stroke-width="1" color="black" />
      </div>
    </div>
    <div v-if="isOpen" class="dropdown">
      <div
        v-for="option in options"
        :key="option.value"
        class="dropdown-item"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  options: { label: string; value: string }[];
  value: string;
  handleChange: (value: string) => void;
}>()

const emit = defineEmits(['update:value'])

const isOpen = ref(false)
const selectedOption = ref(props.options.find(opt => opt.value === props.value)?.label)

watch(
  () => props.value,
  (newValue) => {
    selectedOption.value = props.options.find(opt => opt.value === newValue)?.label || ''
  }
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: { label: string; value: string }) => {
  selectedOption.value = option.label
  emit('update:value', option.value)
  props.handleChange(option.value)
  isOpen.value = false
}
</script>

<style lang="less" scoped>
.custom-select {
  display: inline-block;
  position: relative;
}

.select-container {
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  padding: 2px;
  width: 90px;
  height: 26px;
}

.selected-option {
  flex: 1;
  font-size: 12px;
  padding-left: 8px;
  color: #333;
}

.arrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 6px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  color: white;
  font-weight: 500;
  background-color: #1e1e1e;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  margin-top: 4px;
  z-index: 1000;
  padding: 8px;
}

.dropdown-item {
  font-size: 12px;
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  &:hover {
    background-color: #0d99ff;
  }
}
</style>