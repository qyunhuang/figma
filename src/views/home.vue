<template>
  <div 
    class="container"
    @contextmenu.prevent="handleRightClick"
  >
    <LeftSideBar 
      :selectedObjectIds="selectedObjectIdsRef"
      :setSelectedObjectIds="setSelectedObjectIdsRef"
      :modify-shape-by-id="modifyShapeById"
    />
    <CanvasContainer :onMounted="handleCanvasMounted" />
    <RightSideBar 
      :setElAttrs="setElAttrsRef" 
      :elAttrs="elAttrsRef" 
      :modify-shape="modifyShape"
      :handle-export="handleExport"
    />
    <ToolBelt 
      :selectedToolRef="selectedToolRef" 
      :setSelectedToolRef="setSelectedToolRef" 
      :addImage="addImage"
    />
    <ContextMenu
      ref="contextMenuRef"
      @select="handleMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { fabric } from 'fabric'
import { AlignGuidelines } from "fabric-guideline-plugin"
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
  handleCanvasObjectsGrouped,
  handleCanvasObjectsUngrouped,
  handleCanvasObjectFront,
  handleCanvasObjectBack,
  handleCanvasAddImage,
} from '@/lib/canvas'
import { 
  loadObjectsToCanvas,
  formatPropertyVlaue,
  exportToPicture,
} from '@/lib/shape'
import { useStore } from '@/stores'
import CanvasContainer from '@/components/CanvasContainer.vue'
import { OptionType, Attributes } from '@/types/type'
import ContextMenu from '@/components/ui/ContextMenu.vue'
import { handleKeyDown } from '@/lib/keyEvents'

const store = useStore()
const syncShapeInStorage = store.syncShapeInStorage
const deleteShapeInStorage = store.deleteShapeInStorage
const undo = store.undo
const redo = store.redo
const frontShapeInStorage = store.frontShapeInStorage
const backShapeInStorage = store.backShapeInStorage

let fabricCanvas: fabric.Canvas = {} as fabric.Canvas

const canvasRef = ref<HTMLCanvasElement | null>(null)
const shapeRef = ref<fabric.Object | null>(null)
const selectedToolRef = ref<OptionType>('move')
const isDraggingRef = ref<boolean>(false)
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
const pathToDrawRef = ref<fabric.Path | null>(null)
const updatedPathRef = ref<[string, number, number] | [string, number, number, number, number] | null>(null)
const isMouseDownRef = ref<boolean>(false)
const rememberedPositionRef = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const isDrawingCurveRef = ref<boolean>(false)

let lastPositionRef: { x: number; y: number } = { x: 0, y: 0 }

const addImage = (imgUrl: string) => {
  handleCanvasAddImage({ canvas: fabricCanvas, imgUrl, syncShapeInStorage })
}

const modifyShapeById = (objectId: string, key: string, value: any) => {
  const shape = fabricCanvas.getObjects().find((obj: any) => obj.objectId === objectId)
  if (!shape) return
  shape.set(key as keyof object, value)
  fabricCanvas.renderAll()
}

const modifyShape = (property: string, value: any) => {
  const shape = fabricCanvas.getActiveObject()

  if (!shape || shape?.type === "activeSelection") return

  value = formatPropertyVlaue(property, value)

  if (property === "width") {
    shape.set("scaleX", 1)
    shape.set("width", value)
  } else if (property === "height") {
    shape.set("scaleY", 1)
    shape.set("height", value)
  } else {
    if (shape[property as keyof object] === value) return
    shape.set(property as keyof object, value)
  }

  fabricCanvas.renderAll()

  syncShapeInStorage(shape)
}

const handleExport = (pictureType: string) => {
  exportToPicture(pictureType, fabricCanvas)
}

const handleRightClick = (event: MouseEvent) => {
  if (fabricCanvas.getActiveObjects().length < 1) return
  contextMenuRef.value?.openMenu(event)
}

const handleMenuSelect = (value: string) => {
  if (value === 'group') {
    handleCanvasObjectsGrouped({ canvas: fabricCanvas, syncShapeInStorage, deleteShapeInStorage })
  } else if (value === 'ungroup') {
    handleCanvasObjectsUngrouped({ canvas: fabricCanvas, syncShapeInStorage, deleteShapeInStorage })
  } else if (value == 'front') {
    handleCanvasObjectFront({ canvas: fabricCanvas, frontShapeInStorage })
  } else if (value === 'back') {
    handleCanvasObjectBack({ canvas: fabricCanvas, backShapeInStorage })
  }
}

const setSelectedToolRef = (shape: OptionType) => {
  selectedToolRef.value = shape
}

const setElAttrsRef = (attrs: Attributes) => {
  elAttrsRef.value = attrs
}

const setSelectedObjectIdsRef = (ids: string[]) => {
  selectedObjectIdsRef.value = ids
  handleCanvasObjectSelected({ canvas: fabricCanvas, objectIds: ids, isProgrammaticSelectionRef })
}

watch(() => selectedToolRef.value, (shape) => {
  if (shape === 'pencil' && fabricCanvas) {
    fabricCanvas.isDrawingMode = true
    fabricCanvas.freeDrawingBrush.width = 1
  }
})

// 定义回调函数，接收子组件的 canvasRef
const handleCanvasMounted = (ref: HTMLCanvasElement | null) => {
  canvasRef.value = ref

  fabricCanvas = initializeFabric({ canvasRef })

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
  })

  // 移除旋转控制
  const controls = fabric.Object.prototype.controls
  const rotateControls = controls.mtr
  rotateControls.visible = false

  const storedCanvasObjects = store.loadCanvasFromStorage()
  if (storedCanvasObjects) {
    loadObjectsToCanvas(fabricCanvas, storedCanvasObjects)
  }

  // fix this
  const guideline = new AlignGuidelines({
    canvas: fabricCanvas,
    aligningOptions: {
      lineWidth: 1.3,
    },
  })

  guideline.init()

  const cancelDrawing = () => {
    if (!pathToDrawRef.value) return
    pathToDrawRef.value.path?.pop()

    if (pathToDrawRef.value.path && pathToDrawRef.value.path.length > 1) {
       // @ts-ignore
      let dims = pathToDrawRef.value._calcDimensions();
      pathToDrawRef.value.set({
        width: dims.width,
        height: dims.height,
        left: dims.left,
        top: dims.top,
         // @ts-ignore
        pathOffset: {
          x: dims.width / 2 + dims.left,
          y: dims.height / 2 + dims.top
        },
        dirty: true,
        selectable: true,
      })
      syncShapeInStorage(pathToDrawRef.value)
      fabricCanvas.setActiveObject(pathToDrawRef.value)
        
    } else {
      fabricCanvas.remove(pathToDrawRef.value);
    }

    fabricCanvas.renderAll()

    pathToDrawRef.value = null
  }

  fabricCanvas.on('mouse:down', (options) => {
    if (selectedToolRef.value === 'hand') {
      isDraggingRef.value = true
      fabricCanvas.selection = false
      lastPositionRef = { x: options.e.clientX, y: options.e.clientY }
    } else {
      handleMouseMoveDown({ options, canvas: fabricCanvas, shapeRef, selectedToolRef, pathToDrawRef, isMouseDownRef })
    }
  })

  fabricCanvas.on('mouse:move', (options) => {
    if (isDraggingRef.value) {
      const e = options.e
      const vpt = fabricCanvas.viewportTransform
      if (!vpt) return
      vpt[4] += e.clientX - lastPositionRef.x
      vpt[5] += e.clientY - lastPositionRef.y
      lastPositionRef = { x: e.clientX, y: e.clientY }
      fabricCanvas.renderAll()
    } else {
      handleMouseMove({ options, canvas: fabricCanvas, shapeRef, selectedToolRef, pathToDrawRef, updatedPathRef, rememberedPositionRef, isDrawingCurveRef, isMouseDownRef })
    }
  })

  fabricCanvas.on('mouse:up', (options) => {
    isDraggingRef.value = false
    fabricCanvas.selection = true
    handleMouseMoveUp({ options, canvas: fabricCanvas, shapeRef, syncShapeInStorage, isDrawingCurveRef, isMouseDownRef, pathToDrawRef, selectedToolRef })
    if (['rect', 'line', 'ellipse', 'triangle', 'text'].includes(selectedToolRef.value)) {
      selectedToolRef.value = 'move'
    }
  })

  fabricCanvas.on('mouse:wheel', function (options) {
    const delta = options.e.deltaY
    const ctrlKey = options.e.ctrlKey
    if (ctrlKey) {
      let zoom = fabricCanvas.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      const pointer = fabricCanvas.getPointer(options.e)
      fabricCanvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom)
      options.e.preventDefault()
      options.e.stopPropagation()
    }
  })

  fabricCanvas.on('selection:created', (options) => {
    handleCanvasSelectionCreated({ options, setElAttrsRef, setSelectedObjectIdsRef, isProgrammaticSelectionRef })
  })

  fabricCanvas.on('selection:updated', (options) => {
    handleCanvasSelectionCreated({ options, setElAttrsRef, setSelectedObjectIdsRef, isProgrammaticSelectionRef })
  })

  fabricCanvas.on('selection:cleared', () => {
    handleCanvasSelectionCleared({ setElAttrsRef, setSelectedObjectIdsRef })
  })

  fabricCanvas.on("object:moving", (options) => {
    handleCanvasObjectMoving({ options, elAttrsRef, canvas: fabricCanvas, setElAttrsRef })
  })

  fabricCanvas.on("object:scaling", (options) => {
    handleCanvasObjectScaling({ options, elAttrsRef, canvas: fabricCanvas, setElAttrsRef })
  })

  fabricCanvas.on("object:modified", (options) => {
    handleCanvasObjectModified({ options, syncShapeInStorage });
  });

  fabricCanvas.on("path:created", (options) => {
    handleCanvasPathCreated({ options, syncShapeInStorage })
  })

  window.addEventListener("keydown", (e) => {
    handleKeyDown({ e, canvas: fabricCanvas, selectedToolRef, syncShapeInStorage, deleteShapeInStorage, undo, redo, cancelDrawing })
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
