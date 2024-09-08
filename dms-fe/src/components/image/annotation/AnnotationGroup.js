import React, {useEffect, useState,} from 'react';
import EyeIcon from '../../common/icon/EyeIcon';
import Chevron from '../../common/icon/Chevron';
import AnnotationItem from './AnnotationItem';
import {useDispatch, useSelector} from "react-redux";
import DisabledEyeIcon from "../../common/icon/DisabledEyeIcon";
import {addHiddenItems, clearHiddenItems} from "../../../duck/slice/LabelSlice";
import './annotation.css';
import {ShapeType} from "../../../constants/AnnotationConstant";

const AnnotationGroup = ({
                             children,
                             annotation,
                             currentClass,
                             selectedItem,
                             colorScheme,
                             title
                         }) => {
    const [isSelected, setSelected] = useState(false);
    const containerStyle = {
        color: '#000000',
        display: 'flex',
        padding: '14px',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    };

    const {defaultColor} = {
        [ShapeType.box]: 'green',
        [ShapeType.line]: 'yellow',
        [ShapeType.polygon]: 'blue',
        [ShapeType.polyline]: 'yellow',
        [ShapeType.points]: 'red'
    }
    const dispatch = useDispatch();
    const {hiddenItems} = useSelector(state => state.labelState);
    const isHidden = annotation
        .filter((label) => label.className === currentClass)
        .every(item => hiddenItems.includes(item.id));

    const addHiddenItem = () => {
        dispatch(addHiddenItems(annotation
            .filter((label) => label.className === currentClass).map(label => label.id)));
    };

    const removeHiddenItem = () => {
        dispatch(clearHiddenItems(annotation
            .filter((label) => label.className === currentClass).map(label => label.id)));
    };

    useEffect(() => {
        const isHovered = annotation.find(label => label.id === selectedItem.id && label.className === currentClass);
        if (isHovered) setSelected(true);
    }, [selectedItem]);


    const onClick = () => {
        setSelected((prev) => !prev);
    };

    return (
        <div className="my-group border-solid mb-2">
            <div className="rounded annotation-group" onClick={onClick}>
                <Chevron
                    style={{
                        transform: `rotate(${isSelected ? 90 : 0}deg)`,
                        transition: 'linear 0.2s all', cursor: 'pointer'
                    }}

                />
                <span style={{flex: 1}}>{title}</span>
                {
                    (isHidden ?
                            <DisabledEyeIcon onClick={() => {
                                removeHiddenItem();
                            }}/> :
                            <EyeIcon onClick={() => {
                                addHiddenItem();
                            }}/>
                    )
                }
            </div>
            {annotation
                .filter((label) => label.className === currentClass)
                .map((label, index) => (
                    <AnnotationItem
                        labelId={label.id}
                        isVisible={isSelected}
                        isSelected={label.id && label.id === selectedItem.id}
                        colorScheme={colorScheme || defaultColor[label.shape.type]}
                        title={`${currentClass} - ${index + 1}`}
                    />
                ))}
        </div>
    );
};
export default AnnotationGroup;
