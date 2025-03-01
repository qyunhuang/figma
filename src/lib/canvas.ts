import { fabric } from 'fabric'
import { Ref } from 'vue'
import { CanvasMouseMoveDown, CanvasMouseMove, CanvasMouseMoveUp } from '@/types/type'
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
    selectionBorderColor: '#0d99ff',
    selectionColor: '#0d99ff22',
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
} : CanvasMouseMoveDown) => {
  
  const pointer = canvas.getPointer(options.e)
  const target = canvas.findTarget(options.e, false)

  if (target && target.type === selectedShapeRef.value) {
    canvas.setActiveObject(target)
    target.setCoords()
  } else {
    shapeRef.value = createSpecificShape(selectedShapeRef.value, pointer as any)
  
    if (shapeRef.value) {
      shapeRef.value.set({ 
        visible: false,
      })
      canvas.add(shapeRef.value)
    }
  }
}

export const handleMouseMove = ({
  options,
  canvas,
  selectedShapeRef,
  shapeRef,
}: CanvasMouseMove) => {
  if (selectedShapeRef.value === "pencil") return
  canvas.isDrawingMode = false
  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
  }
  const pointer = canvas.getPointer(options.e)
  switch (selectedShapeRef?.value) {
    case "rect":
      shapeRef.value?.set({
        width: pointer.x - (shapeRef.value?.left || 0),
        height: pointer.y - (shapeRef.value?.top || 0),
      })
      break
    case "ellipse":
        (shapeRef.value as fabric.Ellipse)?.set({
          rx: Math.abs(pointer.x - (shapeRef.value?.left || 0)) / 2,
          ry: Math.abs(pointer.y - (shapeRef.value?.top || 0)) / 2,
        })
        break
    case "triangle":
      shapeRef.value?.set({
        width: pointer.x - (shapeRef.value?.left || 0),
        height: pointer.y - (shapeRef.value?.top || 0),
      })
      break
    case "line":
        (shapeRef.value as fabric.Line)?.set({
          x2: pointer.x,
          y2: pointer.y,
        })
        break
    default:
      break
  }
  canvas.renderAll()
}

export const handleMouseMoveUp = ({
  shapeRef,
}: CanvasMouseMoveUp) => {
  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
  }
  shapeRef.value = null
}