import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHoveredItem,
  clearHoveredItem,
  addHiddenItems,
  clearHiddenItems,
} from '../../../duck/slice/LabelSlice';
import EyeIcon from '../../common/icon/EyeIcon';
import DisabledEyeIcon from '../../common/icon/DisabledEyeIcon';

const AnnotationItem = ({
  labelId,
  children,
  isVisible = false,
  isSelected,
  colorScheme,
  title
}) => {
  const [showEye, setShowEye] = useState(false);
  const dispatch = useDispatch();

  const { hiddenItems } = useSelector((state) => state.labelState);
  const isHidden = hiddenItems.find((item) => item === labelId);

  const ref = useRef(false);
  const onMouseEnter = () => {
    setShowEye(true);
    if (!isHidden) dispatch(setHoveredItem({ id: labelId }));
  };

  const onMouseLeave = () => {
    setShowEye(false);
    if (!isHidden) dispatch(clearHoveredItem());
  };

  const addHiddenItem = () => {
    dispatch(addHiddenItems([labelId]));
    dispatch(clearHoveredItem());
  };

  const removeHiddenItem = () => {
    dispatch(clearHiddenItems([labelId]));
  };

  useEffect(() => {
    if (ref) {
      // ref.current.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'center',
      // });
    }
  }, [isSelected]);

  const itemStyle = {
    color: '#000000',
    display: isVisible ? 'flex' : 'none',
    padding: '14px',
    alignItems: 'center',
    backgroundColor: isSelected ? 'pink' : 'white',
  };

  const mouseEvents = {
    onMouseEnter,
    onMouseLeave,
  };

  return (
    <div className="annotation-item" style={itemStyle} {...mouseEvents} ref={ref}>
      <div
        className="annotation-item__color-box"
        style={{
          backgroundColor: colorScheme,
        }}
      />
      <span style={{ flex: 1, marginLeft: '1rem' }}>{title}</span>
      {showEye &&
        (isHidden ? (
          <DisabledEyeIcon
            onClick={() => {
              removeHiddenItem();
            }}
          />
        ) : (
          <EyeIcon
            onClick={() => {
              addHiddenItem();
            }}
          />
        ))}
    </div>
  );
};
export default AnnotationItem;
