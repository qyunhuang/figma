import { defineStore } from 'pinia'
import { fabric } from 'fabric'
import { loadObjectsToCanvas, addObjectIdToGroupObjects } from '@/lib/shape'

export const useStore = defineStore('main', {
  state: () => ({
    canvasObjects: <any[]>[],
    undoStack: <string[]>[],
    redoStack: <string[]>[],
  }),
  getters: {
    getObjectById: (state) => (objectId: string) => {
      return state.canvasObjects.find((obj) => obj.objectId === objectId)
    },
    getIndexById: (state) => (objectId: string) => {
      return state.canvasObjects.findIndex((obj) => obj.objectId === objectId)
    }
  },
  actions: {
    saveState() {
      if (this.undoStack.length >= 50) this.undoStack.shift()
      this.undoStack.push(JSON.stringify(this.canvasObjects))
      this.redoStack = []
    },
    undo(canvas: fabric.Canvas) {
      if (this.undoStack.length > 0) {
        const lastState = this.undoStack.pop()
        this.redoStack.push(JSON.stringify(this.canvasObjects))
        this.canvasObjects = JSON.parse(lastState!)
        loadObjectsToCanvas(canvas, this.canvasObjects)
        localStorage.setItem('canvasObjects', lastState!)
      }
    },
    redo(canvas: fabric.Canvas) {
      if (this.redoStack.length > 0) {
        const nextState = this.redoStack.pop()
        this.undoStack.push(JSON.stringify(this.canvasObjects))
        this.canvasObjects = JSON.parse(nextState!)
        loadObjectsToCanvas(canvas, this.canvasObjects)
        localStorage.setItem('canvasObjects', nextState!)
      }
    },
    loadCanvasFromStorage() {
      const storedData = localStorage.getItem('canvasObjects')
      if (storedData == null) {
        this.canvasObjects = []
        localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
        return this.canvasObjects
      }
      const storedDataParsed = JSON.parse(storedData)
      if (Array.isArray(storedDataParsed)) {
        this.canvasObjects = storedDataParsed
      } else {
        this.canvasObjects = []
        localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
      }
      this.saveState()
      return this.canvasObjects
    },
    syncShapeInStorage(object: fabric.Object) {
      if (!object) return
      const { objectId } = object as any

      this.saveState()
      
      const shapeData: any = object.toJSON(['selectable', 'lockScalingX', 'lockScalingY'])
      addObjectIdToGroupObjects(object, shapeData)
    
      const index = this.getIndexById(objectId)
      if (index === -1) {
        this.canvasObjects.push(shapeData)
      } else {
        this.canvasObjects[index] = shapeData
      }
    
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    frontShapeInStorage(objectId: string) {
      const index = this.getIndexById(objectId)
      if (index === -1) return
      this.saveState()
      const object = this.canvasObjects.splice(index, 1)[0]
      this.canvasObjects.push(object)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
   backShapeInStorage(objectId: string) {
      const index = this.getIndexById(objectId)
      if (index === -1) return
      this.saveState()
      const object = this.canvasObjects.splice(index, 1)[0]
      this.canvasObjects.unshift(object)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    deleteShapeInStorage(objectId: string) {
      this.saveState()
      this.canvasObjects = this.canvasObjects.filter((obj) => obj.objectId !== objectId)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    modifyShapeInStorage(objectId: string, property: string, value: any) {
      const index = this.getIndexById(objectId)
      if (index === -1) return
      this.saveState()
      this.canvasObjects[index][property] = value
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    }
  },
})

