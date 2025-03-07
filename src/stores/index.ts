import { defineStore } from 'pinia'
import { fabric } from 'fabric'
import { addObjectIdToGroupObjects } from '@/lib/shape'

export const useStore = defineStore('main', {
  state: () => ({
    canvasObjects: <Record<string, any>>{},
  }),
  getters: {
    getObjectById: (state) => (objectId: string) => {
      return state.canvasObjects[objectId]
    }
  },
  actions: {
    loadCanvasFromStorage() {
      const storedData = localStorage.getItem('canvasObjects')
      if (storedData) {
        this.canvasObjects = JSON.parse(storedData)
      }
      return this.canvasObjects
    },
    syncShapeInStorage(object: fabric.Object) {
      if (!object) return
      const { objectId } = object as any
    
      const shapeData: any = object.toJSON()
      addObjectIdToGroupObjects(object, shapeData)
    
      this.canvasObjects[objectId] = shapeData
    
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    deleteShapeInStorage(objectId: string) {
      if (!this.canvasObjects[objectId]) return
      delete this.canvasObjects[objectId]
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    },
    modifyShapeInStorage(objectId: string, property: string, value: any) {
      if (!this.canvasObjects[objectId]) return
      this.canvasObjects[objectId][property] = value
      localStorage.setItem('canvasObjects', JSON.stringify(this.canvasObjects))
    }
  },
})

