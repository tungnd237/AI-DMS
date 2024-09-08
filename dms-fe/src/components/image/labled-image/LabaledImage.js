import React, { useEffect, useRef } from 'react';
import Two from 'two.js';
import { ShapeType } from '../../../constants/AnnotationConstant';
import {useSelector} from "react-redux";
import '../../../css/tooltip/tooltip.css';
import { v4 as uuidv4 } from 'uuid';
import thumbnail from "../../../images/thumbnail_na.jpg"

const LabeledImage = ({
  annotations,
  predictions,
  src,
  resolution = { width: 1920, height: 1208 },
  maxHeight = 1000,
  maxWidth = 1700,
  onHover,
  onLeave,
  onMove,
  colorSchemes,
  onImageloaded,
  useToolTip = false,
}) => {
  const container = useRef(false);
  const two = useRef(
    new Two({ ...resolution, ratio: resolution.width / resolution.height })
  );
  const shapeElements = useRef([]);
  const toolTip = useRef(useToolTip);

  const {hoveredItem, hiddenItems} = useSelector(state => state.labelState);

  useEffect(() => {
    if (hoveredItem.id) {
      shapeElements.current.forEach((shape) => {
        shape.createdShapes.forEach((s) => {
          const labelId = s.renderer.elem.getAttribute('data-label-id');
          if (labelId !== hoveredItem.id) {
            s.renderer.elem.setAttribute('opacity', 0.1);
          } else {
            s.renderer.elem.setAttribute('opacity', 1);
          }
        });
      });
    } else {
      shapeElements.current.forEach((shape) => {
        shape.createdShapes.forEach((s) => {
          s.renderer.elem.setAttribute('opacity', 1);
        });
      });

      if(hiddenItems) {
        shapeElements.current.forEach((shape) => {
          shape.createdShapes.forEach((s) => {
            const labelId = s.renderer.elem.getAttribute('data-label-id');
            if (hiddenItems.includes(labelId)) {
              s.renderer.elem.setAttribute('display', 'none');
            } else {
              s.renderer.elem.removeAttribute('display');
            }
          });
        });
      }
    }
  }, [hoveredItem.id, shapeElements, hiddenItems]);

  useEffect(() => {
    if (two && container) {
      two.current.appendTo(container.current);
      two.current.renderer.domElement.setAttribute(
        'viewBox',
        `0 0 ${resolution.width} ${resolution.height}`
      );
      two.current.renderer.domElement.style.position = 'absolute';
      two.current.renderer.domElement.style.inset = '0px';
      two.current.renderer.domElement.style.width = '100%';
      two.current.renderer.domElement.style.height = '100%';
      // two.current.renderer.domElement.removeAttribute('height');
      // two.current.renderer.domElement.removeAttribute('width');
    }
  }, []);

  useEffect(() => {
    two.current.renderer.domElement.setAttribute(
        'viewBox',
        `0 0 ${resolution.width} ${resolution.height}`
    );
  }, [resolution]);

  useEffect(() => {
    let shapes = []
    if (container) {
      if (annotations) {
        const annotatedShapes = annotations
            .map((annotation) =>
                getLabelInfo(annotation, "annotation")
            )
            .flatMap((shape) => shape)
            .flatMap(({ shape, shapeType, className, id, type }) => drawShape(shape, shapeType, className, id, type));
        // two.current.update()
        shapes = shapes.concat(annotatedShapes)
        // shapeElements.current = annotatedShapes;
        // addToolTipForShape();
      }
      if (predictions) {
        const predictedShapes = predictions
            .map((prediction) =>
                getLabelInfo(prediction, "prediction")
            )
            .flatMap((shape) => shape)
            .flatMap(({ shape, shapeType, className, id, type }) => drawShape(shape, shapeType, className, id, type));
        // two.current.update();

        shapes = shapes.concat(predictedShapes)

      }
      two.current.update();
      shapeElements.current = shapes;
      if (shapes.length > 0) {
        addToolTipForShape();
      }
    }

    return cleanUp;
  }, [container, annotations, predictions, two]);

  const cleanUp = () => {
    shapeElements.current.forEach((shape) => {
      shape.createdShapes.forEach((s) => {
        s.renderer.elem.removeEventListener('mouseover', onHoverShape);
        s.renderer.elem.removeEventListener('mouseleave', onMouseLeave);
        s.renderer.elem.removeEventListener('mousemove', onMouseMove);
      });
    });
    two.current.clear();
  };

  const addToolTipForShape = () => {
    shapeElements.current.forEach((shape) => {
      shape.createdShapes.forEach((s) => {
        s.renderer.elem.addEventListener('mouseover', onHoverShape);
        s.renderer.elem.addEventListener('mouseleave', onMouseLeave);
        s.renderer.elem.addEventListener('mousemove', onMouseMove);
        s.renderer.elem.setAttribute('data-label-id', shape.id);
        if (shape.type === 'annotation') {
          s.renderer.elem.setAttribute('data-label-className', `${shape.className} - Ground Truth`);
        }
        else {
          s.renderer.elem.setAttribute('data-label-className', `${shape.className}`);

        }
      });
    });
  };

  const onHoverShape = (e) => {
    const labelId = e.target.getAttribute('data-label-id');
    if (onHover)
      onHover(shapeElements.current.find((shape) => shape.id === labelId));
  };

  const onMouseLeave = (e) => {
    const labelId = e.target.getAttribute('data-label-id');
    if (toolTip && useToolTip) {
      toolTip.current.style.opacity = 0;
    }

    if (onLeave) {
      onLeave(shapeElements.current.find((shape) => shape.id === labelId));
    }
  };

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (toolTip && useToolTip) {
      toolTip.current.style.opacity = 1;
      toolTip.current.style.left =
        Math.max(0, clientX - toolTip.current.offsetWidth - 100) + 'px';
      toolTip.current.style.top =
        Math.max(0, clientY - toolTip.current.offsetHeight - 130) + 'px';
      const labelId =
        toolTip.current.getElementsByClassName('tooltip__label-id');
      const colorViewer = toolTip.current.getElementsByClassName(
        'tooltip__label-color'
      );
      if (labelId.length) {
        labelId[0].innerHTML = `${e.target.getAttribute('data-label-className')}`;
      }
      if (colorViewer) {
        colorViewer[0].style.backgroundColor = e.target.getAttribute('stroke');
      }
    }
    if (onMove) {
      const labelId = e.target.getAttribute('data-label-id');
      onMove(shapeElements.current.find((shape) => shape.id === labelId));
    }
  };

  const getLabelInfo = (label, type) => {
    return { type: type, className: label.className || label.class_name, shape: label.shape, shapeType: label.shapeType, id: label.id || uuidv4() };
  };

  const decorShapeByLabelType = (shape, type) => {
    if (type === "annotation") {
      shape.stroke = 'green';
      shape.noFill();
    }
    else {
      // shape.dashes = [20, 4];
      shape.stroke = 'orange';
      shape.noFill();
    }
  }

  const drawShape = ({ vertices }, shapeType, className, id, type) => {
    const createdShapes = [];
    const color = colorSchemes.find((c) => c.classCode === className);
    switch (shapeType) {
      case ShapeType.polyline:
        const anchors = [];
        for (let i = 0; i < vertices.length; i++) {
          anchors.push(
            new Two.Anchor(
              vertices[i][0],
              vertices[i][1],
              0,
              0,
              0,
              0,
              Two.Commands.line
            )
          );
        }
        const polyLine = two.current.makePath(anchors, true);
        decorShapeByLabelType(polyLine, type)
        // polyLine.noFill();
        // polyLine.stroke = (color && color.colorCode) || '#FF8000';
        polyLine.linewidth = 5;
        createdShapes.push(polyLine);
        break;
      case ShapeType.line:
        for (let i = 0; i < vertices.length - 1; i++) {
          const line = two.current.makeLine(
            vertices[i][0],
            vertices[i][1],
            vertices[i + 1][0],
            vertices[i + 1][1]
          );
          line.fill = color.colorCode || '#FF8000';
          line.stroke = color.colorCode || 'orangered';
          line.linewidth = 2.5;
          createdShapes.push(line);
        }
        break;
      case ShapeType.polygon:
        const anchors2 = [];
        for (let i = 0; i < vertices.length; i++) {
          anchors2.push(
            new Two.Anchor(
              vertices[i][0],
              vertices[i][1],
              0,
              0,
              0,
              0,
              Two.Commands.line
            )
          );
        }
        const polygon = two.current.makePath(anchors2, false);
        // polygon.noFill();
          decorShapeByLabelType(polygon, type)

        // polygon.stroke = (color && color.colorCode) || '#136201';
        // polygon.fill = (color && color.colorCode) || '#FF8000';
        polygon.linewidth = 5;
        polygon.opacity = 0.5;
        createdShapes.push(polygon);
        break;
      case ShapeType.box:
        const x1y1 = vertices[0];
        const x2y2 = vertices[1];
        const x = (x1y1[0] + x2y2[0]) / 2;
        const y = (x1y1[1] + x2y2[1]) / 2;
        const box = two.current.makeRectangle(
          x,
          y,
          Math.abs(x1y1[0] - x2y2[0]),
          Math.abs(x1y1[1] - x2y2[1])
        );
        // box.fill = (color && color.colorCode) || 'green';
        decorShapeByLabelType(box, type);
        box.opacity = 0.5;
        // box.dashes = [4, 10];
        // box.stroke = (color && color.colorCode) || 'green';
        box.linewidth = 4;
        createdShapes.push(box);
        break;
      case ShapeType.points:
        const base = vertices[0];
        const p = two.current.makeCircle(base[0], base[1], 10);
        p.fill = (color && color.colorCode) || 'green';
        p.stroke = (color && color.colorCode) || 'green';
        p.opacity = 1;
        createdShapes.push(p);
        break;
      case ShapeType.cuboid:
        console.log('cuboid', vertices);
        break;
      default:
        console.log('does not support', shapeType);
        console.log('points', JSON.stringify(vertices));
        break;
    }
    return { id, createdShapes, className };
  };

  return (
    <div className="w-full h-full" style={{ maxWidth }}>
      <div
        style={{
          transform: 'scale(1) translate(0px, 0px)',
          transformOrigin: '0px 0px',
        }}
        ref={container}
      >
        <div>
          <img
            className="w-full h-full"
            alt="failed to load"
            src={src}
            width={resolution.width}
            height={resolution.height}
            style={{
              aspectRatio: `auto ${resolution.width}/${resolution.height}`,
            }}
            onError={event => {
              // console.log(event);
              event.target.src = thumbnail;
              event.onerror = null;
            }}
            onLoad={() => console.log('loaded')}
          />
          {useToolTip && (
            <div
              ref={toolTip}
              className="mouse tooltip"
            >
              <div
                className="tooltip__label-color"
                style={{
                  background: 'red',
                }}
              />
              <div
                className="tooltip__label-id ml-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabeledImage;
