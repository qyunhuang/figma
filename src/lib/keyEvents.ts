import { v4 as uuidv4 } from "uuid"
import { fabric } from "fabric"

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects()
  const padding = 20
  if (activeObjects.length === 1) {
    const serializedObjects = [{
      ...activeObjects[0].toObject(),
      left: activeObjects[0].left as number + padding,
      top: activeObjects[0].top as number + padding,
    }]
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects))
  } else if (activeObjects.length > 1) {
    const groupLeft = activeObjects[0].group?.left as number
    const groupTop = activeObjects[0].group?.top as number
    const groupWidth = activeObjects[0].group?.width as number
    const groupHeight = activeObjects[0].group?.height as number

    const serializedObjects = activeObjects.map((obj) => {
      const left = obj.left as number
      const top = obj.top as number
      return {
        ...obj.toObject(),
        left: groupLeft + groupWidth / 2 + left + padding,
        top: groupTop + groupHeight / 2 + top + padding,
      }
    })
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects))
  }
}

export const handlePaste = (
  canvas: fabric.Canvas,
  syncShapeInStorage: (shape: fabric.Object) => void
) => {
  if (!canvas || !(canvas instanceof fabric.Canvas)) {
    return
  }

  const clipboardData = localStorage.getItem("clipboard")

  if (clipboardData) {
    try {
      const parsedObjects = JSON.parse(clipboardData)
      parsedObjects.forEach((objData: fabric.Object) => {
        fabric.util.enlivenObjects(
          [objData],
          (enlivenedObjects: fabric.Object[]) => {
            enlivenedObjects.forEach((enlivenedObj) => {
              enlivenedObj.set({
                objectId: uuidv4(),
              } as any)

              canvas.add(enlivenedObj)
              syncShapeInStorage(enlivenedObj)
            })
            canvas.renderAll()
          },
          "fabric"
        )
      })
    } catch (error) {
      console.error("Error parsing clipboard data:", error)
    }
  }
}

export const handleDelete = (
  canvas: fabric.Canvas,
  deleteShapeInStorage: (id: string) => void,
) => {
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

export const handleKeyDown = ({
  e,
  canvas,
  syncShapeInStorage,
  deleteShapeInStorage,
  undo,
  redo,
}: {
  e: KeyboardEvent;
  canvas: fabric.Canvas | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeInStorage: (id: string) => void;
  undo: (canvas: fabric.Canvas) => void;
  redo: (canvas: fabric.Canvas) => void;
}) => {
  if (e.key === 'Delete') {
    handleDelete(canvas, deleteShapeInStorage)
  }

  if ((e?.ctrlKey || e?.metaKey) && e.key === "c") {
    handleCopy(canvas)
  }

  if ((e?.ctrlKey || e?.metaKey) && e.key === "v") {
    handlePaste(canvas, syncShapeInStorage)
  }

  if ((e?.ctrlKey || e?.metaKey) && e.key === "x") {
    handleCopy(canvas)
    handleDelete(canvas, deleteShapeInStorage)
  }

  if ((e?.ctrlKey || e?.metaKey) && (e.key === "z" || e.key === "Z")) {
    if (e.shiftKey) {
      redo(canvas)
    } else {
      undo(canvas)
    }
  }
}
