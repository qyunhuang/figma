import { fabric } from "fabric"
import { v4 as uuidv4 } from "uuid"
import { CustomFabricObject, ModifyShape } from "@/types/type"

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent
) => {
  switch (shapeType) {
    case "rect":
      return createRectangle(pointer)
    case "triangle":
      return createTriangle(pointer)
    case "ellipse":
      return createEllipse(pointer)
    case "line":
      return createLine(pointer)
    case "text":
      return createText(pointer, "Tap to Type")
    default:
      return null
  }
}

export const createRectangle = (pointer: PointerEvent) => {
  return new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#d9d9d9",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>)
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

export const createEllipse = (pointer: PointerEvent) => {
  return new fabric.Ellipse({
    left: pointer.x,
    top: pointer.y,
    rx: 100,
    ry: 100,
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
    fill: "black",
    fontFamily: "Helvetica",
    fontSize: 16,
    fontWeight: "400",
    objectId: uuidv4()
  } as fabric.ITextOptions)
}

const formatPropertyVlaue = (property: string, value: any) => {
  if (property === 'fill' || property === 'stroke') {
    return value
  } else {
    return parseInt(value)
  }
}

export const modifyShape = ({
  canvas,
  property,
  value,
}: ModifyShape) => {
  if (!canvas) return
  const selectedElement = canvas.getActiveObject()
  console.log(selectedElement)

  if (!selectedElement || selectedElement?.type === "activeSelection") return

  value = formatPropertyVlaue(property, value)

  if (property === "width") {
    selectedElement.set("scaleX", 1)
    selectedElement.set("width", value); 
  } else if (property === "height") {
    selectedElement.set("scaleY", 1)
    selectedElement.set("height", value)
  } else {
    if (selectedElement[property as keyof object] === value) return
    selectedElement.set(property as keyof object, value)
    console.log(selectedElement)
  }
}