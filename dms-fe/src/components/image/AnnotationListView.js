import React, { useContext, useEffect, useRef } from 'react';
import AnnotationGroup from './annotation/AnnotationGroup';
import {getClassCount} from "../../utils/Utils";
import { v4 as uuidv4 } from 'uuid';

const AnnotationListView = ({
  annotations = [],
  predictions = [],
  id,
  selectedItem,
  name,
  camera,
  colorSchemes,
  path,
}) => {
  const groupRef = useRef([]);
  groupRef.current = annotations.map(() => React.createRef());

  const getColorScheme = (annotationClassName) => {
    const color = colorSchemes.find(
      (colorScheme) => colorScheme.classCode === annotationClassName
    );
    return color && color.colorCode;
  };

  const renderGroup = (labels) => {
    let classCount = getClassCount(labels);
    return Object.keys(classCount || {}).map((annotationClassName) => (
        <AnnotationGroup
          key={annotationClassName}
          annotation={labels}
          currentClass={annotationClassName}
          selectedItem={selectedItem}
          colorScheme={getColorScheme(annotationClassName)}
          title={annotationClassName}
        />
      )
    );
  };

  return (
    <div className="p-1">
      <div
        style={{
          'borderBottom': '1px solid #E6E6E6',
          'marginBottom': '16px',
          'paddingBottom': '16px',
        }}
      >
        <h3 style={{ color: '#000', margin: '0 0 24px', fontSize: '20px' }}>
          Image Detail
        </h3>
        <div>
          Image Id: <b>{id}</b>
        </div>
        <div>
          Image name: <b>{name}</b>
        </div>
        <div>
          Image path: <b>{path}</b>
        </div>
        <div>
          From camera: <b>{camera}</b>
        </div>
      </div>
      <div className="mt-5">
        <h4
          style={{
            color: ' rgba(0, 0, 0, 0.6)',
            margin: '0 0 14px',
            fontWeight: 700,
          }}
        >
          Ground Truth
        </h4>
        {renderGroup(annotations)}
      </div>
        <div className="mt-5">
            <h4
                style={{
                    color: ' rgba(0, 0, 0, 0.6)',
                    margin: '0 0 14px',
                    fontWeight: 700,
                }}
            >
                Predictions
            </h4>
            {renderGroup(predictions)}
        </div>
    </div>

  );
};

export default AnnotationListView;
