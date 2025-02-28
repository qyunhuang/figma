import { Ref } from 'vue'

export type selectedShapeRefType = 'rect' | 'line' | 'circle' | 'triangle' | 'image'

export type CanvasMouseDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  shapeRef: Ref<fabric.Object | null>;
}

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}