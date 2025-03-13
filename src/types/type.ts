import { Ref } from 'vue'

export type OptionType = 'move' | 'hand' | 'rect' | 'line' | 'ellipse' | 'triangle' | 'pen' | 'pencil' | 'text' | 'image'

export type CanvasMouseMoveDown = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedToolRef: any;
  shapeRef: Ref<fabric.Object | null>;
  pathToDrawRef: Ref<fabric.Path | null>;
  isMouseDownRef: Ref<boolean>;
}

export type CanvasMouseMove = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  selectedToolRef: any;
  shapeRef: Ref<fabric.Object | null>;
  pathToDrawRef: Ref<fabric.Path | null>;
  updatedPathRef: Ref<[string, number, number] | [string, number, number, number, number] | null>;
  isMouseDownRef: Ref<boolean>;
  rememberedPositionRef: Ref<{ x: number; y: number }>;
  isDrawingCurveRef: Ref<boolean>;
}

export type CanvasMouseMoveUp = {
  options: fabric.IEvent;
  canvas: fabric.Canvas;
  shapeRef: Ref<fabric.Object | null>;
  syncShapeInStorage: (shape: fabric.Object) => void;
  selectedToolRef: any;
  pathToDrawRef: Ref<fabric.Path | null>;
  isMouseDownRef: Ref<boolean>;
  isDrawingCurveRef: Ref<boolean>;
}

export type CanvasSelectionCreated = {
  options: fabric.IEvent;
  setElAttrsRef: (attrs: Attributes) => void;
  setSelectedObjectIdsRef: (ids: string[]) => void;
  isProgrammaticSelectionRef: Ref<boolean>;
}

export type CanvasSelectionCleared  = {
  setElAttrsRef: (attrs: Attributes) => void;
  setSelectedObjectIdsRef: (ids: string[]) => void;
}

export type CanvasPathCreated = {
  options: (fabric.IEvent & { path: CustomFabricObject<fabric.Path> }) | any;
  syncShapeInStorage: (shape: fabric.Object) => void;
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

export type CanvasObjectModified = {
  options: fabric.IEvent;
  syncShapeInStorage: (shape: fabric.Object) => void;
}

export type CanvasObjectSelected = {
  canvas: fabric.Canvas;
  objectIds: string[];
  isProgrammaticSelectionRef: Ref<boolean>;
}

export type CanvasObjectGrouped = {
  canvas: fabric.Canvas;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeInStorage: (ids: string) => void;
}

export type CanvasObjectFront = {
  canvas: fabric.Canvas;
  frontShapeInStorage: (objectId: string) => void;
}

export type CanvasObjectBack = {
  canvas: fabric.Canvas;
  backShapeInStorage: (objectId: string) => void;
}

export type CanvasAddImage = {
  canvas: fabric.Canvas;
  imgUrl: string;
  syncShapeInStorage: (shape: fabric.Object) => void;
}

export interface CustomFabricObject<T extends fabric.Object>
  extends fabric.Object {
  objectId?: string;
}

export interface CustomFabricGroup extends fabric.Group {
  objectId?: string;
}

export type Attributes = {
  type: string;
  left: string;
  top: string;
  width: string;
  height: string;
  angle: string;
  fill: string;
  opacity: string;
  stroke: string;
  strokeWidth: string;
  fontSize: string;
  fontWeight: string;
}

export type ModifyShape = {
  canvas: fabric.Canvas | null;
  property: string;
  value: any;
  syncShapeInStorage: (shape: fabric.Object) => void;
}

export type ModifyVisibility = {
  canvas: fabric.Canvas | null;
  objectId: string;
}

export type ModifySelectablility = {
  canvas: fabric.Canvas | null;
  objectId: string;
}