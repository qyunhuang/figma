<template>
  <div
    v-if="menuVisible"
    class="context-menu"
    :style="{ left: menuLeft + 'px', top: menuTop + 'px' }"
  >
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="menu-item"
      @click="handleMenuItemClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const menuItems = ref([
  { label: 'Group selection', value: 'group' },
  { label: 'Ungroup', value: 'ungroup' },
])

const emit = defineEmits(['select'])

const menuVisible = ref(false)
const menuLeft = ref(0)
const menuTop = ref(0)

const openMenu = (event: MouseEvent) => {
  menuVisible.value = true
  menuLeft.value = event.clientX
  menuTop.value = event.clientY

  document.addEventListener('click', closeMenu)
}

const closeMenu = () => {
  menuVisible.value = false
  document.removeEventListener('click', closeMenu)
}

const handleMenuItemClick = (item: { label: string; value: string }) => {
  emit('select', item.value)
  closeMenu()
}

defineExpose({
  openMenu,
  closeMenu,
})
</script>

<style lang="less" scoped>
.context-menu {
  position: fixed;
  background-color: #1e1e1e;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 8px;
}

.menu-item {
  font-size: 12px;
  color: #fff;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #0d99ff;
  }
}
</style>