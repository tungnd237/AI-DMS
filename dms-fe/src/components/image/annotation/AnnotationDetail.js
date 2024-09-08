import React from 'react';
import AnnotationListView from '../AnnotationListView';
import LabeledImage from '../labled-image/LabaledImage';

export default function AnnotationDetail({
  annotations,
  predictions,
  colorSchemes,
  image,
  src,
  selectedItem,
}) {
  return (
    <div className="mt-6 flex" style={{ maxHeight: '85%' }}>
      <LabeledImage
        src={src}
        annotations={annotations}
        predictions={predictions}
        colorSchemes={colorSchemes}
        useToolTip
      />
      <div style={{ width: '40%', marginLeft: '2rem', overflowY: 'auto' }}>
        <AnnotationListView
          id={image && image.id}
          name={image && image.filename}
          camera={image && image.camera}
          path={src}
          annotations={annotations}
          predictions={predictions}
          selectedItem={selectedItem}
          colorSchemes={colorSchemes}
        />
      </div>
    </div>
  );
}
