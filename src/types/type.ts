import { Ref } from 'vue'

export type selectedShapeRefType = 'rect' | 'line' | 'ellipse' | 'triangle' | 'image'

export type CanvasMouseDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  shapeRef: Ref<fabric.Object | null>;
  startPointRef: Ref<{ x: number; y: number } | null>;
}

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}