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
  CanvasObjectGrouped,
  CanvasObjectFront,
  CanvasObjectBack,
  CanvasAddImage,
} from '@/types/type'
import { createSpecificShape, createGroup } from './shape'
import { v4 as uuidv4 } from "uuid"

const mixedAttributes = {
  type: 'Mixed',
  left: 'Mixed',
  top: 'Mixed',
  width: 'Mixed',
  height: 'Mixed',
  angle: 'Mixed',
  fill: 'Mixed',
  opacity: 'Mixed',
  stroke: 'Mixed',
  strokeWidth: 'Mixed',
  fontSize: 'Mixed',
  fontWeight: 'Mixed',
}

const defaultAttributes = {
  type: '',
  left: '',
  top: '',
  width: '',
  height: '',
  angle: '',
  fill: '',
  opacity: '',
  stroke: '',
  strokeWidth: '',
  fontSize: '',
  fontWeight: '',
}

export const initializeFabric = ({
  canvasRef,
}: {
  canvasRef: Ref<HTMLCanvasElement | null>
}) => {
  // 确保 canvasRef.value 存在且是 HTMLCanvasElement
  if (!canvasRef.value) {
    console.error('Canvas element is not available.')
    return {} as fabric.Canvas
  }

  // 获取 canvas 元素的父容器尺寸
  const canvasElement = canvasRef.value
  if (!canvasElement) {
    console.error('Canvas is not available.')
    return {} as fabric.Canvas
  }

  // 初始化 Fabric.js 画布
  const canvas = new fabric.Canvas(canvasRef.value, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
    backgroundColor: '#f5f5f5',
    selectionBorderColor: '#0d99ff',
    selectionColor: '#0d99ff22',
  })

  return canvas
}

export const handleMouseMoveDown = ({
  options,
  canvas,
  selectedToolRef,
  shapeRef,
  pathToDrawRef,
  isMouseDownRef,
}: CanvasMouseMoveDown) => {
  const pointer = canvas.getPointer(options.e)
  const target = canvas.findTarget(options.e, false)

  if (selectedToolRef.value === "pen") {
    isMouseDownRef.value = true
    if (!pathToDrawRef.value) {
      pathToDrawRef.value = new fabric.Path(`M${pointer.x} ${pointer.y} L${pointer.x} ${pointer.y}`, {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'transparent',
        objectId: uuidv4(),
      } as any)
      pathToDrawRef.value.selectable = false
      pathToDrawRef.value.strokeUniform = true
      canvas.add(pathToDrawRef.value)
    } else {
      pathToDrawRef.value.path?.push(['L', pointer.x, pointer.y] as any)

      let dims = (pathToDrawRef.value as any)._calcDimensions()
      pathToDrawRef.value.set({
        width: dims.width,
        height: dims.height,
        left: dims.left,
        top: dims.top,
        pathOffset: {
          x: dims.width / 2 + dims.left,
          y: dims.height / 2 + dims.top
        },
        dirty: true
      } as any)
      pathToDrawRef.value.setCoords()
    }

    canvas.renderAll()
    return
  }

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
  shapeRef,
  pathToDrawRef,
  updatedPathRef,
  isMouseDownRef,
  rememberedPositionRef,
  isDrawingCurveRef,
}: CanvasMouseMove) => {
  const inRange = (radius: number, cursorX: number, cursorY: number, targetX: number, targetY: number) => {
    if (
      Math.abs(cursorX - targetX) <= radius &&
      Math.abs(cursorY - targetY) <= radius
    ) {
      return true
    }

    return false
  }

  if (selectedToolRef.value === "pencil") return
  const pointer = canvas.getPointer(options.e)

  if (selectedToolRef.value === "pen" && pathToDrawRef.value) {
    if (!isDrawingCurveRef.value) {
      updatedPathRef.value = ['L', pointer.x, pointer.y]
    }

    pathToDrawRef.value.path?.pop()

    if (pathToDrawRef.value.path && pathToDrawRef.value.path.length > 1) {
      let snapPoints = [...pathToDrawRef.value.path] as any
      snapPoints.pop()
      for (let p of snapPoints) {
        if ((p[0] === 'L' || p[0] === 'M') && inRange(10, pointer.x, pointer.y, p[1], p[2]) && updatedPathRef.value) {
          updatedPathRef.value[1] = p[1]
          updatedPathRef.value[2] = p[2]
          break
        }

        if (p[0] === 'Q' && inRange(10, pointer.x, pointer.y, p[3], p[4]) && updatedPathRef.value) {
          updatedPathRef.value[1] = p[3]
          updatedPathRef.value[2] = p[4]
          break
        }
      }
    }

    if (isMouseDownRef.value) {
      if (!isDrawingCurveRef.value && pathToDrawRef.value.path && pathToDrawRef.value.path.length > 1) {
        isDrawingCurveRef.value = true

        let lastPath = pathToDrawRef.value.path.pop() as any

        if (lastPath[0] === 'Q') {
          updatedPathRef.value = ['Q', lastPath[3], lastPath[4], lastPath[3], lastPath[4]]
          rememberedPositionRef.value.x = lastPath[3]
          rememberedPositionRef.value.y = lastPath[4]
        } else {
          updatedPathRef.value = ['Q', lastPath[1], lastPath[2], lastPath[1], lastPath[2]]
          rememberedPositionRef.value.x = lastPath[1]
          rememberedPositionRef.value.y = lastPath[2]
        }

      } else if (isDrawingCurveRef.value) {
        let mouseMoveX = pointer.x - (updatedPathRef.value as  [string, number, number, number, number])[3]
        let mouseMoveY = pointer.y - (updatedPathRef.value as  [string, number, number, number, number])[4]

        updatedPathRef.value = [
          'Q',
          rememberedPositionRef.value.x - mouseMoveX,
          rememberedPositionRef.value.y - mouseMoveY,
          rememberedPositionRef.value.x,
          rememberedPositionRef.value.y
        ]

      }
    }

    pathToDrawRef.value.path?.push(updatedPathRef.value as any)

    let dims = (pathToDrawRef.value as any)._calcDimensions();
    pathToDrawRef.value.set({
      width: dims.width,
      height: dims.height,
      left: dims.left,
      top: dims.top,
      pathOffset: {
        x: dims.width / 2 + dims.left,
        y: dims.height / 2 + dims.top
      },
      dirty: true
    } as any)
    canvas.renderAll()
    return
  }

  canvas.isDrawingMode = false
  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
  }
  // fix this
  switch (selectedToolRef?.value) {
    case "rect":
      shapeRef.value?.set({
        width: pointer.x - (shapeRef.value?.left || 0),
        height: pointer.y - (shapeRef.value?.top || 0),
      })
      canvas.renderAll()
      break
    case "ellipse":
      (shapeRef.value as fabric.Ellipse)?.set({
        rx: Math.abs(pointer.x - (shapeRef.value?.left || 0)) / 2,
        ry: Math.abs(pointer.y - (shapeRef.value?.top || 0)) / 2,
      })
      canvas.renderAll()
      break
    case "triangle":
      shapeRef.value?.set({
        width: pointer.x - (shapeRef.value?.left || 0),
        height: pointer.y - (shapeRef.value?.top || 0),
      })
      canvas.renderAll()
      break
    case "line":
      (shapeRef.value as fabric.Line)?.set({
        x2: pointer.x,
        y2: pointer.y,
      })
      canvas.renderAll()
      break
    default:
      break
  }
}

export const handleMouseMoveUp = ({
  options,
  canvas,
  shapeRef,
  pathToDrawRef,
  isDrawingCurveRef,
  isMouseDownRef,
  selectedToolRef,
  syncShapeInStorage,
}: CanvasMouseMoveUp) => {
  isMouseDownRef.value = false
  const pointer = canvas.getPointer(options.e)
  if (selectedToolRef.value === 'pen' && isDrawingCurveRef.value && pathToDrawRef.value) {
    pathToDrawRef.value.path?.push(['L', pointer.x, pointer.y] as any)

    let dims = (pathToDrawRef.value as any)._calcDimensions()
    pathToDrawRef.value.set({
      width: dims.width,
      height: dims.height,
      left: dims.left,
      top: dims.top,
      pathOffset: {
        x: dims.width / 2 + dims.left,
        y: dims.height / 2 + dims.top
      },
      dirty: true
    } as any)
    pathToDrawRef.value.setCoords()
    canvas.renderAll()
  }
  isDrawingCurveRef.value = false

  
  if (shapeRef.value) {
    shapeRef.value.set({ visible: true })
    syncShapeInStorage(shapeRef.value as fabric.Object)
  }
  shapeRef.value = null
}

export const handleCanvasSelectionCreated = ({
  options,
  setElAttrsRef,
  setSelectedObjectIdsRef,
  isProgrammaticSelectionRef
}: CanvasSelectionCreated) => {
  if (!options?.selected) return

  // 避免无限循环
  isProgrammaticSelectionRef.value = false

  const selectedIds = options.selected.map((obj) => (obj as any).objectId)
  setSelectedObjectIdsRef(selectedIds)

  const selectedEl = options?.selected[0] as fabric.Object
  console.log(selectedEl)
  if (selectedEl && options.selected.length === 1) {
    const scaledWidth = selectedEl?.scaleX
      ? selectedEl?.width! * selectedEl?.scaleX
      : selectedEl?.width

    const scaledHeight = selectedEl?.scaleY
      ? selectedEl?.height! * selectedEl?.scaleY
      : selectedEl?.height

    setElAttrsRef({
      type: selectedEl?.type || '',
      left: selectedEl.left?.toFixed(0).toString() || '',
      top: selectedEl.top?.toFixed(0).toString() || '',
      width: scaledWidth?.toFixed(0).toString() || '',
      height: scaledHeight?.toFixed(0).toString() || '',
      angle: selectedEl.angle?.toFixed(0).toString() || '',
      fill: selectedEl?.type === 'group' ? 'Mixed' : (selectedEl.fill?.toString() || ''),
      opacity: selectedEl?.type === 'group' ? 'Mixed' : (selectedEl.opacity?.toString() || ''),
      stroke: selectedEl.stroke?.toString() || '',
      strokeWidth: selectedEl.strokeWidth?.toString() || '',
      // @ts-ignore
      fontSize: selectedEl.fontSize?.toString() || '',
      // @ts-ignore
      fontWeight: selectedEl.fontWeight?.toString() || '',
    })
  } else if (options.selected.length > 1) {
    setElAttrsRef(mixedAttributes)
  }

  isProgrammaticSelectionRef.value = true
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
    objectId: uuidv4(),
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
  if (!isProgrammaticSelectionRef.value) return

  // 通过leftsidebar选中canvas中的object
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
}

export const handleCanvasObjectsGrouped = ({
  canvas,
  syncShapeInStorage,
  deleteShapeInStorage,
}: CanvasObjectGrouped) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 1) {
    const left = activeObjects[0].group!.left as number
    const top = activeObjects[0].group!.top as number

    // 复制对象并处理组的情况
    const clonedObjects = activeObjects.map((obj: any) => {
      if (obj.type === 'group') {
        return createGroup(
          obj.getObjects().map((child: any) => fabric.util.object.clone(child)), 
          obj.left,
          obj.top,
          obj.objectId
        )
      } else {
        // 如果是普通对象，直接克隆
        return {
          ...fabric.util.object.clone(obj),
          objectId: obj.objectId,
        }
      }
    })

    const group = createGroup(clonedObjects, left, top)

    canvas.add(group)
    syncShapeInStorage(group)

    canvas.discardActiveObject()
    canvas.remove(...activeObjects)
    activeObjects.forEach((obj) => {
      deleteShapeInStorage((obj as any)?.objectId)
    })

    canvas.setActiveObject(group)
    canvas.renderAll()
  }
}

export const handleCanvasObjectsUngrouped = ({
  canvas,
  syncShapeInStorage,
  deleteShapeInStorage,
}: CanvasObjectGrouped) => {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length === 1 && activeObjects[0].type === 'group') {
    const group = activeObjects[0] as fabric.Group
    const objects = group.getObjects()

    group.destroy()
    canvas.remove(group)
    deleteShapeInStorage((group as any)?.objectId)

    objects.forEach((obj: any) => {
      canvas.add(obj)
      syncShapeInStorage(obj)
    })

    canvas.discardActiveObject()
    canvas.renderAll()
  }
}

export const handleCanvasObjectFront = ({
  canvas,
  frontShapeInStorage,
}: CanvasObjectFront) => {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length === 1) {
    const obj = activeObjects[0]
    canvas.bringToFront(obj)
    frontShapeInStorage((obj as any)?.objectId)
    canvas.renderAll()
  }
}

export const handleCanvasObjectBack = ({
  canvas,
  backShapeInStorage,
}: CanvasObjectBack) => {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length === 1) {
    const obj = activeObjects[0]
    canvas.sendToBack(obj)
    backShapeInStorage((obj as any)?.objectId)
    canvas.renderAll()
  }
}

export const handleCanvasAddImage = ({
  canvas,
  imgUrl,
  syncShapeInStorage,
}: CanvasAddImage) => {
  fabric.Image.fromURL(imgUrl, (img: any) => {
    // fix this
    img.set({
      left: 0,
      top: 0,
      objectId: uuidv4(),
    })
    canvas.add(img)
    canvas.setActiveObject(img)
    canvas.renderAll()
    syncShapeInStorage(img)
  })
}
