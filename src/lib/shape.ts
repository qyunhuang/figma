import { fabric } from "fabric"
import { v4 as uuidv4 } from "uuid"
import { CustomFabricObject } from "@/types/type"

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "Rectangle":
      return createRectangle(pointer)

    case "Triangle":
      return createTriangle(pointer)

    case "Circle":
      return createCircle(pointer)

    case "Line":
      return createLine(pointer)

    case "Text":
      return createText(pointer, "Tap to Type")

    default:
      return null
  }
}

export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#d9d9d9",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>)

  return rect
}

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#d9d9d9",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>)
}

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#d9d9d9",
    objectId: uuidv4(),
  } as any)
}

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#d9d9d9",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  )
}

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#d9d9d9",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4()
  } as fabric.ITextOptions)
}