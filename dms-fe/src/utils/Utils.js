import moment from "moment";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

export const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export const getFilenameFromHeader = (headers, defaultFilename) => {
    if (headers['content-disposition'])
        return headers['content-disposition'].split('filename=')[1];
    return defaultFilename
}

export const onClickUrl = (url) => openInNewTab(url)

export const convertToTimestamp = (time) => {
    return time ? moment.unix(time / 1e6) : undefined
}

export const getAllAnnotationsLabels = (dataItem) => {
    return dataItem.annotations.map(a => a.labels).flat(1);
}

export const getAllPredictionsLabels = (dataItem) => {
    return Object.values(dataItem.inferences)
        .map(inf => Object.values(inf.predictions))
        .flat(2)
        .filter(inf => inf)
        .map(inf => {
            if (!inf.id) {
                return {...inf, id: uuidv4()}
            }
            return inf;
        })
}

export const getClassCount = (annotations) => {
    return annotations.reduce((count, ann) => {
        let className = ann.className || ann.class_name;
        if (!count.hasOwnProperty(className)) {
            count[className] = 0;
        }
        count[className]++;
        return count;
    }, {})
}

