import { Ref } from 'vue'

export type OptionType = 'move' | 'hand' | 'rect' | 'line' | 'ellipse' | 'triangle' | 'pen' | 'pencil' | 'text'

export type CanvasMouseMoveDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  shapeRef: Ref<fabric.Object | null>;
  startPointRef: Ref<{ x: number; y: number } | null>;
}

export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedShapeRef: any;
  shapeRef: Ref<fabric.Object | null>;
  startPointRef: Ref<{ x: number; y: number } | null>;
}

export type CanvasMouseMoveUp = {
  shapeRef: Ref<fabric.Object | null>;
}

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}