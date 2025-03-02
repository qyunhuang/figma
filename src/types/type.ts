import { Ref } from 'vue'

export type OptionType = 'move' | 'hand' | 'rect' | 'line' | 'ellipse' | 'triangle' | 'pen' | 'pencil' | 'text'

export type CanvasMouseMoveDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedToolRef: any;
  shapeRef: Ref<fabric.Object | null>;
  startPointRef: Ref<{ x: number; y: number } | null>;
}

export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedToolRef: any;
  shapeRef: Ref<fabric.Object | null>;
  startPointRef: Ref<{ x: number; y: number } | null>;
}

export type CanvasMouseMoveUp = {
  shapeRef: Ref<fabric.Object | null>;
}

export type CanvasSelectionCreated = {
  options: fabric.IEvent;
  setElAttrsRef: (attrs: Attributes) => void;
}

export type CanvasSelectionCleared  = {
  setElAttrsRef: (attrs: Attributes) => void;
}

export type CanvasObjectMoving = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  elAttrsRef: Ref<Attributes>;
  setElAttrsRef: (attrs: Attributes) => void;
}

export type CanvasObjectScaling = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  elAttrsRef: Ref<Attributes>;
  setElAttrsRef: (attrs: Attributes) => void;
}

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}

export type Attributes = {
  left: string;
  top: string;
  width: string;
  height: string;
  angle: string;
  fill: string;
  opacity: string;
  stroke: string;
  strokeWidth: string;
}

export type ModifyShape = {
  canvas: fabric.Canvas | null;
  property: string;
  value: any;
}