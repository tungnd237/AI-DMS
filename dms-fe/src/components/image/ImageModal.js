import React, { useEffect, useState, useRef } from 'react';
import closeIcon from '../../images/close-icon.svg';
import LabeledImage from './labled-image/LabaledImage';
import AnnotationListView from './AnnotationListView';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import {
  clearAllHiddenItems,
  clearHoveredItem,
} from '../../duck/slice/LabelSlice';
import {getAllAnnotationsLabels, getAllPredictionsLabels} from "../../utils/Utils";

export const AnnotationContext = React.createContext({ test: 'abc' });

const ImageModal = ({ handleClose, modalObj, colorSchemes }) => {
  const [annotations, setAnnotations] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const dispatch = useDispatch();
  const detail = useRef(false);

  useEffect(() => {
    console.log(modalObj)

    if (modalObj.annotations) {
      // const currentAnnotation = [...modalObj.annotations];
      const currentAnnotation = getAllAnnotationsLabels(modalObj);

      // currentAnnotation.forEach((a) => {
      //   (a.labels || []).forEach((l) => {
      //     l.id = uuidv4();
      //   });
      // });

      setAnnotations(currentAnnotation);
    }
  }, [modalObj.annotations]);

  useEffect(() => {
    if (modalObj.inferences) {
      // const currentPredictions = [...modalObj.predictions];
      const currentPredictions = getAllPredictionsLabels(modalObj)
      // currentPredictions.forEach((a) => {
      //   (a.labels || []).forEach((l) => {
      //     l.id = uuidv4();
      //   });
      // });

      setPredictions(currentPredictions);
    }
  }, [modalObj.inferences]);

  let showHideClassName = modalObj.show
    ? 'modal block z-50 h-screen w-screen fixed inset-0 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-16'
    : 'modal hidden';

  useEffect(() => {
    if (!modalObj.show) {
      setAnnotations([]);
      dispatch(clearAllHiddenItems());
      dispatch(clearHoveredItem());
    }
  }, [modalObj.show]);

  const modalResize = () => {
    console.log('modal resize');
    if (detail && detail.current) {
      // detail.current.style.h
    }
  };

  useEffect(() => {
    window.addEventListener('resize', modalResize);
    return () => {
      window.removeEventListener('resize', modalResize);
    };
  }, []);

  const resolution = {
    width: 1280,
    height: 720
  }

  if(modalObj && modalObj.metadata) {
    resolution.height = modalObj.metadata.height;
    resolution.width = modalObj.metadata.width;
  }

  return (
    <div
      className={showHideClassName}
      style={{ backgroundColor: `rgba(125,125,125,.7)` }}
    >
      <section className="modal-main bg-white h-full w-full p4 relative rounded p-4 shadow-lg lg:block overflow-auto flex">
        <button
          className="inline-block text-sm p4 leading-none border rounded text-black border-black hover:border-transparent hover:text-teal-500 hover:bg-white absolute top-0 right-0 m-2"
          onClick={handleClose}
        >
          <img src={closeIcon} alt="close button" />
        </button>

        <AnnotationContext.Provider
          value={{ hoveredItem: {}, hiddenItems: [] }}
        >
          <div className="mt-6 flex" style={{ maxHeight: '85%' }}>
            <LabeledImage
              src={modalObj.url}
              annotations={annotations}
              predictions={predictions}
              colorSchemes={colorSchemes}
              onHover={({ id, className }) => {
                setSelectedItem({ id, className });
              }}
              onLeave={({ id, className }) => {
                setSelectedItem({});
              }}
              onMove={({ id }) => {
                console.log('move', id);
              }}
              useToolTip
              resolution={resolution}
            />
            <div
              style={{ width: '40%', marginLeft: '2rem', overflowY: 'auto' }}
              ref={detail}
            >
              <AnnotationListView
                id={modalObj.id}
                name={modalObj.name}
                path={modalObj.location}
                camera={modalObj.metadata && modalObj.metadata.cameraType}
                annotations={annotations}
                predictions={predictions}
                selectedItem={selectedItem}
                colorSchemes={colorSchemes}
              />
            </div>
          </div>
        </AnnotationContext.Provider>
      </section>
    </div>
  );
};

export default ImageModal;
