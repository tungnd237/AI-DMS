import React, {useState, useEffect} from 'react';
import LazyLoad from 'react-lazyload';
import Pagination from '../pagination/Pagination';
import ImageModal from './ImageModal';
import LabeledImage from './labled-image/LabaledImage';
import '../../css/image-results.css';
import {ItemViewMode} from "../../constants/DataItemConstant";
import {getAllPredictionsLabels} from "../../utils/Utils";

const ImageResults = ({
                          currentPage,
                          setCurrentPage,
                          imageData,
                          colorSchemes,
                          showPlayerView,
                          mode
                      }) => {
    let [modalObj, setShowModal] = useState({});

    const handleCardClick = (item, e, src) => {
        e.preventDefault();
        setShowModal({...item, show: true, src});
    };

    const closeModal = (e) => {
        e.preventDefault();
        setShowModal({show: false});
    };

    const getLabels = (item) => {
        switch (mode) {
            case ItemViewMode.INFERENCE:
                return Object.values(item.inference.predictions).flat(1).filter(inf => inf)
                    ;
            case ItemViewMode.ANNOTATION:
                return item.annotations.map(a => a.labels).flat(1).filter(inf => inf)
                    ;
            default:
                return item.annotations.map(a => a.labels).flat(1).filter(inf => inf)
                    ;

        }

    }

    return (
        <main className="relative">
            <div
                className={`${
                    showPlayerView ? 'hidden' : 'duration-500 translate-x-0'
                }`}
            >
                <section
                    id="gallery"
                    className={`${showPlayerView ? 'hidden' : 'gridStyle'} mb-4`}
                >
                    {imageData.elements.map((item) => (
                        // <LazyLoad height={200} offset={[-200, 0]} once key={item.id}>
                        <div
                            onClick={(e) =>
                                handleCardClick(
                                    item,
                                    e,
                                    item.url
                                )
                            }
                            className="cursor-pointer"
                        >
                            <LabeledImage
                                src={item.url}
                                annotations={getLabels(item)}
                                colorSchemes={colorSchemes}
                                resolution={{width: item.metadata.width, height: item.metadata.height}}
                            />
                        </div>
                        // </LazyLoad>
                    ))}
                </section>
                <section
                    className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center justify-between w-full p-6 mb-4">
                    <h3 className="text-1xl font-light text-left mb-2 ">
                        {imageData.totalElements} results
                    </h3>

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={imageData.totalPages}
                    />
                </section>

                <ImageModal
                    handleClose={closeModal}
                    modalObj={modalObj}
                    colorSchemes={colorSchemes}
                />
            </div>
        </main>
    );
};

export default ImageResults;
