import { defineStore } from 'pinia'
import { fabric } from 'fabric'
import { addObjectIdToGroupObjects } from '@/lib/shape'

export const useStore = defineStore('main', {
  state: () => ({
    canvasObjects: <any[]>[],
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
      return this.canvasObjects
    },
    syncShapeInStorage(object: fabric.Object) {
      if (!object) return
      const { objectId } = object as any
      
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
      const object = this.canvasObjects.splice(index, 1)[0]
      this.canvasObjects.push(object)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
   backShapeInStorage(objectId: string) {
      const index = this.getIndexById(objectId)
      if (index === -1) return
      const object = this.canvasObjects.splice(index, 1)[0]
      this.canvasObjects.unshift(object)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    deleteShapeInStorage(objectId: string) {
      this.canvasObjects = this.canvasObjects.filter((obj) => obj.objectId !== objectId)
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    modifyShapeInStorage(objectId: string, property: string, value: any) {
      const index = this.getIndexById(objectId)
      if (index === -1) return
      this.canvasObjects[index][property] = value
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    }
  },
})

