<template>
  <div 
    class="container"
    @contextmenu.prevent="handleRightClick"
  >
    <LeftSideBar 
      :fabric="fabricRef" 
      :canvasObjects="canvasObjects"
      :selectedObjectIds="selectedObjectIdsRef"
      :setSelectedObjectIds="setSelectedObjectIdsRef"
    />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar 
      :fabric="fabricRef" 
      :setElAttrs="setElAttrsRef" 
      :elAttrs="elAttrsRef" 
      :syncShapeInStorage="syncShapeInStorage" 
    />
    <ToolBelt 
      :selectedToolRef="selectedToolRef" 
      :setSelectedToolRef="setSelectedToolRef" 
    />
    <ContextMenu
      ref="contextMenuRef"
      @select="handleMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
// import { AlignGuidelines } from "fabric-guideline-plugin"
import { 
  initializeFabric, 
  handleMouseMoveDown, 
  handleMouseMove, 
  handleMouseMoveUp, 
  handleCanvasSelectionCreated, 
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCleared,
  handleCanvasPathCreated,
  handleCanvasObjectModified,
  handleCanvasObjectSelected,
  handleCanvasObjectDeleted,
  handleCanvasObjectsGrouped,
  handleCanvasObjectsUngrouped,
} from '@/lib/canvas'
import {  
  loadCanvasFromStorage,
  loadObjectsToCanvas
} from '@/lib/shape'
import CanvasContainer from '@/components/CanvasContainer.vue'
import { OptionType, Attributes } from '@/types/type'
import ContextMenu from '@/components/ui/ContextMenu.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasObjects = ref<Record<string, any>>({})
const fabricRef = ref<fabric.Canvas | null>(null)
const shapeRef = ref<fabric.Object | null>(null)
const selectedToolRef = ref<OptionType>('move')
const startPointRef = ref<{ x: number; y: number } | null>(null)
const isDraggingRef = ref<boolean>(false)
const lastPositionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const selectedObjectIdsRef = ref<string[]>([])
const isProgrammaticSelectionRef = ref<boolean>(true)
const elAttrsRef = ref<Attributes>({
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
})
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)

const handleRightClick = (event: MouseEvent) => {
  if (!fabricRef.value || fabricRef.value.getActiveObjects().length < 1) return
  contextMenuRef.value?.openMenu(event)
}

const handleMenuSelect = (value: string) => {
  if (!fabricRef.value) return
  if (value === 'group') {
    handleCanvasObjectsGrouped({ canvas: fabricRef.value, syncShapeInStorage, deleteShapeInStorage })
  } else if (value === 'ungroup') {
    handleCanvasObjectsUngrouped({ canvas: fabricRef.value, syncShapeInStorage, deleteShapeInStorage })
  }
}

const setSelectedToolRef = (shape: OptionType) => {
  selectedToolRef.value = shape
}

const setElAttrsRef = (attrs: Attributes) => {
  elAttrsRef.value = attrs
}

const setSelectedObjectIdsRef = (ids: string[]) => {
  if (!fabricRef.value) return
  selectedObjectIdsRef.value = ids
  handleCanvasObjectSelected({ canvas: fabricRef.value, objectIds: ids, isProgrammaticSelectionRef })
}

watch(() => selectedToolRef.value, (shape) => {
  if (shape === 'pencil' && fabricRef.value) {
    fabricRef.value.isDrawingMode = true
    fabricRef.value.freeDrawingBrush.width = 1
  }
})

const addObjectIdToGroupObjects = (object: fabric.Object, shapeData: any) => {
  if (!object) return
  if (object.type === 'group') {
    (object as fabric.Group).getObjects().forEach((obj: any, index: number) => {
      addObjectIdToGroupObjects(obj, shapeData.objects[index])
    })
  } 
  shapeData.objectId = (object as any).objectId
}

const syncShapeInStorage = (object: fabric.Object) => {
  if (!object) return
  const { objectId } = object as any

  const shapeData: any = object.toJSON()
  addObjectIdToGroupObjects(object, shapeData)

  canvasObjects.value[objectId] = shapeData

  localStorage.setItem('canvasObjects', JSON.stringify(canvasObjects.value))
}

const deleteShapeInStorage = (objectId: string) => {
  if (!objectId) return
  delete canvasObjects.value[objectId]
  localStorage.setItem('canvasObjects', JSON.stringify(canvasObjects.value))
}

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
    strokeUniform: true,
    borderOpacityWhenMoving: 0,
    borderScaleFactor: 1.5,
  });

  // 移除旋转控制
  const controls = fabric.Object.prototype.controls
  const rotateControls = controls.mtr
  rotateControls.visible = false

  if (!canvas) return

  const storedCanvasObjects = loadCanvasFromStorage()
  canvasObjects.value = storedCanvasObjects
  if (storedCanvasObjects) {
    const objectsData = Object.values(storedCanvasObjects)
    loadObjectsToCanvas(canvas, objectsData)
  }

  // fix this
  // const guideline = new AlignGuidelines({
  //   canvas,
  //   aligningOptions: {
  //     lineWidth: 1.3,
  //   },
  // })

  // guideline.init()

  canvas.on('mouse:down', (options) => {
    if (selectedToolRef.value === 'hand') {
      isDraggingRef.value = true
      canvas.selection = false
      lastPositionRef.value = { x: options.e.clientX, y: options.e.clientY }
    } else {
      handleMouseMoveDown({ options, canvas, shapeRef, selectedToolRef, startPointRef })
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
      canvas.renderAll()
    } else {
      handleMouseMove({ options, canvas, shapeRef, selectedToolRef, startPointRef })
    }
  })

  canvas.on('mouse:up', () => {
    isDraggingRef.value = false
    canvas.selection = true
    handleMouseMoveUp({ shapeRef, syncShapeInStorage })
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

  canvas.on('selection:created', (options) => {
    handleCanvasSelectionCreated({ options, setElAttrsRef, setSelectedObjectIdsRef, isProgrammaticSelectionRef })
  })

  canvas.on('selection:updated', (options) => {
    handleCanvasSelectionCreated({ options, setElAttrsRef, setSelectedObjectIdsRef, isProgrammaticSelectionRef })
  })

  canvas.on('selection:cleared', () => {
    handleCanvasSelectionCleared({ setElAttrsRef, setSelectedObjectIdsRef })
  })

  canvas.on("object:moving", (options) => {
    handleCanvasObjectMoving({ options, elAttrsRef, canvas, setElAttrsRef })
  })

  canvas.on("object:scaling", (options) => {
    handleCanvasObjectScaling({ options, elAttrsRef, canvas, setElAttrsRef })
  })

  canvas.on("object:modified", (options) => {
    handleCanvasObjectModified({ options, syncShapeInStorage });
  });

  canvas.on("path:created", (options) => {
    handleCanvasPathCreated({ options, syncShapeInStorage })
  })

  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete") {
      handleCanvasObjectDeleted({ canvas, deleteShapeInStorage })
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
