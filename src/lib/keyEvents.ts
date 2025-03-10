import { v4 as uuidv4 } from "uuid"
import { fabric } from "fabric"

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects()
  if (activeObjects.length > 0) {
    const serializedObjects = activeObjects.map((obj) => obj.toObject())
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects))
  }

  return activeObjects
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
}: {
  e: KeyboardEvent;
  canvas: fabric.Canvas | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeInStorage: (id: string) => void;
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
}
