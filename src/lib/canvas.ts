import { fabric } from 'fabric'
import { Ref } from 'vue'
import { 
  CanvasMouseMoveDown, 
  CanvasMouseMove, 
  CanvasMouseMoveUp, 
  CanvasSelectionCreated, 
  CanvasObjectMoving,
  CanvasObjectScaling, 
  CanvasSelectionCleared,
  CanvasPathCreated,
  CanvasObjectModified,
  CanvasObjectSelected,
  CanvasObjectDeleted,
} from '@/types/type'
import { createSpecificShape } from './shape'
import { v4 as uuid4 } from "uuid"

const mixedAttributes = {
  left: 'Mixed',
  top: 'Mixed',
  width: 'Mixed',
  height: 'Mixed',
  angle: 'Mixed',
  fill: 'Mixed',
  opacity: 'Mixed',
  stroke: 'Mixed',
  strokeWidth: 'Mixed',
}

const defaultAttributes = {
  left: '',
  top: '',
  width: '',
  height: '',
  angle: '',
  fill: '',
  opacity: '',
  stroke: '',
  strokeWidth: '',
}

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
  selectedToolRef,
  shapeRef,
}: CanvasMouseMoveDown) => {
  const pointer = canvas.getPointer(options.e)
  const target = canvas.findTarget(options.e, false)

  if (target && target.type === selectedToolRef.value) {
    canvas.setActiveObject(target)
    target.setCoords()
  } else {
    shapeRef.value = createSpecificShape(selectedToolRef.value, pointer as any)
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
  selectedToolRef,
  shapeRef
}: CanvasMouseMove) => {
  if (selectedToolRef.value === "pencil") return
  canvas.isDrawingMode = false
  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
  }
  const pointer = canvas.getPointer(options.e)
  switch (selectedToolRef?.value) {
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
  syncShapeInStorage,
}: CanvasMouseMoveUp) => {
  syncShapeInStorage(shapeRef.value as fabric.Object)

  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
  }
  shapeRef.value = null
}

export const handleCanvasSelectionCreated = ({
  options,
  setElAttrsRef,
  setSelectedObjectIdsRef,
}: CanvasSelectionCreated) => {
  if (!options?.selected) return

  const selectedIds = options.selected.map((obj) => (obj as any).objectId)
  setSelectedObjectIdsRef(selectedIds)

  const selectedEl = options?.selected[0] as fabric.Object
  if (selectedEl && options.selected.length === 1) {
    const scaledWidth = selectedEl?.scaleX
      ? selectedEl?.width! * selectedEl?.scaleX
      : selectedEl?.width

    const scaledHeight = selectedEl?.scaleY
      ? selectedEl?.height! * selectedEl?.scaleY
      : selectedEl?.height

    setElAttrsRef({
      left: selectedEl.left?.toFixed(0).toString() || '',
      top: selectedEl.top?.toFixed(0).toString() || '',
      width: scaledWidth?.toFixed(0).toString() || '',
      height: scaledHeight?.toFixed(0).toString() || '',
      angle: selectedEl.angle?.toFixed(0).toString() || '',
      fill: selectedEl.fill?.toString() || '',
      opacity: selectedEl.opacity?.toString() || '',
      stroke: selectedEl.stroke?.toString() || '',
      strokeWidth: selectedEl.strokeWidth?.toString() || '',
    })
  } else if (options.selected.length > 1) {
    setElAttrsRef(mixedAttributes)
  }
}

export const handleCanvasSelectionCleared = ({
  setElAttrsRef,
  setSelectedObjectIdsRef,
}: CanvasSelectionCleared) => {
  setSelectedObjectIdsRef([])
  setElAttrsRef(defaultAttributes)
}

export const handleCanvasPathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  const path = options.path
  if (!path) return

  path.set({
    objectId: uuid4(),
  })

  syncShapeInStorage(path)
}

export const handleCanvasObjectMoving = ({
  options,
  canvas,
  elAttrsRef,
  setElAttrsRef,
}: CanvasObjectMoving) => {
  if (!options.target) return

  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length > 1) {
    setElAttrsRef(mixedAttributes)
    return
  }

  const target = options.target as fabric.Object
  if (target) {
    setElAttrsRef({
      ...elAttrsRef.value,
      left: target.left?.toFixed(0).toString() || '',
      top: target.top?.toFixed(0).toString() || '',
    })
  }
}

export const handleCanvasObjectScaling = ({
  options,
  canvas,
  elAttrsRef,
  setElAttrsRef,
}: CanvasObjectScaling) => {
  if (!options.target) return
  
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length > 1) {
    setElAttrsRef(mixedAttributes)
    return
  }

  const scaledWidth = options.target?.scaleX ? options.target?.width! * options.target?.scaleX : options.target?.width
  const scaledHeight = options.target?.scaleY ? options.target?.height! * options.target?.scaleY : options.target?.height

  const target = options.target as fabric.Object
  if (target) {
    setElAttrsRef({
      ...elAttrsRef.value,
      width: scaledWidth?.toFixed(0).toString() || '',
      height: scaledHeight?.toFixed(0).toString() || '',
    })
  }
}

export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target
  if (!target) return

  if (target?.type == "activeSelection") {
    // fix this
  } else {
    syncShapeInStorage(target)
  }
}

export const handleCanvasObjectSelected = ({
  canvas,
  objectIds,
  isProgrammaticSelectionRef
}: CanvasObjectSelected) => {
  isProgrammaticSelectionRef.value = true

  const objects = canvas.getObjects()
  const targetObjects = objects.filter(
    (obj) => objectIds.includes((obj as any).objectId)
  )

  if (targetObjects.length === 0) {
    canvas.discardActiveObject()
  } else if (targetObjects.length === 1) {
    canvas.setActiveObject(targetObjects[0])
  } else if (targetObjects.length > 1) {
    canvas.discardActiveObject()
    canvas.setActiveObject(new fabric.ActiveSelection(targetObjects, {
      canvas: canvas,
    }))
  }
  canvas.renderAll()

  isProgrammaticSelectionRef.value = false
}

export const handleCanvasObjectDeleted = ({
  canvas,
  deleteShapeInStorage,
}: CanvasObjectDeleted) => {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length > 0) {
    activeObjects.forEach((obj) => {
      // fix this
      canvas.remove(obj)
      canvas.discardActiveObject()
      deleteShapeInStorage((obj as any)?.objectId)
    })
  }
  canvas.renderAll()
}