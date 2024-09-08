import React, {useState, useEffect} from 'react';
import LazyLoad from 'react-lazyload';
import Pagination from '../../pagination/Pagination';
import '../../../css/image-results.css';
import LabeledImage from "../../image/labled-image/LabaledImage";
import {getAllPredictionsLabels} from "../../../utils/Utils";

const ItemCardGridView = ({
                              currentPage,
                              setCurrentPage,
                              items,
                              totalPages,
                              colorSchemes,
                          }) => {

    return (
        <main className="relative">
            <div>
                <section
                    id="gallery"
                    className={`gridStyle mb-4`}
                >
                    {items.map((item) => {
                        let annotations = getAllPredictionsLabels(item);
                        return (
                        // <LazyLoad height={200} offset={[-200, 0]} once key={item.id}>
                        <div>
                            <LabeledImage
                                src={item.type === "IMAGE" ? item.url : item.thumbnailUrl}
                                annotations={annotations}
                                colorSchemes={colorSchemes}
                                resolution={ {width: item.metadata.width || 1920, height: item.metadata.height || 1208}}
                            />
                        </div>)
                        // </LazyLoad>
                    })}
                </section>
                <section
                    className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center justify-between w-full p-6 mb-4">
                    {/*<h3 className="text-1xl font-light text-left mb-2 ">*/}
                    {/*    {imageData.totalElements} results*/}
                    {/*</h3>*/}

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </section>
            </div>
        </main>
    );
};

export default ItemCardGridView;
