import { fabric } from 'fabric'
import { Ref } from 'vue'
import { CanvasMouseDown } from '@/types/type'
import { createSpecificShape } from './shape'

export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: Ref<fabric.Canvas | null>
  canvasRef: Ref<HTMLCanvasElement | null>
}) => {
  // 确保 canvasRef.value 存在且是 HTMLCanvasElement
  if (!canvasRef.value) {
    console.error('Canvas element is not available.')
    return
  }

  // 获取 canvas 元素的父容器尺寸
  const canvasElement = canvasRef.value
  if (!canvasElement) {
    console.error('Canvas is not available.')
    return
  }

  // 初始化 Fabric.js 画布
  const canvas = new fabric.Canvas(canvasRef.value, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight, 
    backgroundColor: '#f5f5f5', 
  })

  // 将 Fabric.js 画布实例赋值给 fabricRef
  fabricRef.value = canvas

  return canvas
}

export const handleMouseMoveDown = ({
  options,
  canvas,
  selectedShapeRef,
  shapeRef,
} : CanvasMouseDown) => {
  const pointer = canvas.getPointer(options.e)
  // const target = canvas.findTarget(options.e, false)
  canvas.isDrawingMode = false
  console.log(selectedShapeRef)

  shapeRef.value = createSpecificShape(selectedShapeRef.value, pointer as any)

  if (shapeRef.value) {
    canvas.add(shapeRef.value)
  }
}

