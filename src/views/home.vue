<template>
  <div class="container">
    <LeftSideBar />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar />
    <ToolBelt :selectedToolRef="selectedToolRef" :setSelectedToolRef="setSelectedToolRef" />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { initializeFabric, handleMouseMoveDown, handleMouseMove, handleMouseMoveUp } from '@/lib/canvas'
import CanvasContainer from '@/components/CanvasContainer.vue'
import { OptionType } from '@/types/type'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fabricRef = ref<fabric.Canvas | null>(null)
const shapeRef = ref<fabric.Object | null>(null)
const selectedToolRef = ref<OptionType>('rect')
const startPointRef = ref<{ x: number; y: number } | null>(null)
const isDraggingRef = ref<boolean>(false)
const lastPositionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })

const setSelectedToolRef = (shape: OptionType) => {
  selectedToolRef.value = shape
}

watch(() => selectedToolRef.value, (shape) => {
  if (shape === 'pencil' && fabricRef.value) {
    fabricRef.value.isDrawingMode = true
    fabricRef.value.freeDrawingBrush.width = 1
  }
})

// 定义回调函数，接收子组件的 canvasRef
const handleCanvasMounted = (ref: HTMLCanvasElement | null) => {
  canvasRef.value = ref

  const canvas = initializeFabric({ canvasRef, fabricRef })

  // 全局样式设置
  fabric.Object.prototype.set({
    borderColor: '#0d99ff',
    cornerStrokeColor: '#0d99ff',
    cornerColor: 'white',
    cornerSize: 8,
    transparentCorners: false,
  });

  // 移除旋转控制
  const controls = fabric.Object.prototype.controls
  const rotateControls = controls.mtr
  rotateControls.visible = false

  if (!canvas) return

  canvas.on('mouse:down', (options) => {
    if (selectedToolRef.value === 'hand') {
      isDraggingRef.value = true
      canvas.selection = false
      lastPositionRef.value = { x: options.e.clientX, y: options.e.clientY }
    } else {
      handleMouseMoveDown({ options, canvas, shapeRef, selectedShapeRef: selectedToolRef, startPointRef })
    }
  })

  canvas.on('mouse:move', (options) => {
    if (isDraggingRef.value) {
      const e = options.e
      const vpt = canvas.viewportTransform
      if (!vpt) return
      vpt[4] += e.clientX - lastPositionRef.value.x
      vpt[5] += e.clientY - lastPositionRef.value.y
      lastPositionRef.value = { x: e.clientX, y: e.clientY }
      canvas.requestRenderAll()
    } else {
      handleMouseMove({ options, canvas, shapeRef, selectedShapeRef: selectedToolRef, startPointRef })
    }
  })

  canvas.on('mouse:up', () => {
    isDraggingRef.value = false
    canvas.selection = true
    handleMouseMoveUp({ shapeRef })
    if (['rect', 'line', 'ellipse', 'triangle', 'text'].includes(selectedToolRef.value)) {
      selectedToolRef.value = 'move'
    }
  })

  canvas.on('mouse:wheel', function (options) {
    const delta = options.e.deltaY
    const ctrlKey = options.e.ctrlKey
    if (ctrlKey) {
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      const pointer = canvas.getPointer(options.e)
      canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom)
      options.e.preventDefault()
      options.e.stopPropagation()
    }
  })
}

</script>

<style lang="less" scoped>
.container {
  position: relative;
  display: flex;
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
}
</style>
