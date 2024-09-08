import React from 'react';
import Loader from '../common/loader/Loader';
import {Img} from 'react-image';


const ImageCard = ({ item, handleCardClick, originalPath, thumbnailPath }) => {
  return (
    <div
      className="w-full h-80 rounded overflow-hidden bg-white shadow-lg relative cursor-pointer parent gridStyle__item"
      key={item.id}
      onClick={e => handleCardClick(item, e, originalPath)}
    >
      <Img src={thumbnailPath} className="object-cover w-full h-full" loader={<Loader/>}/>
      <div className="item__overlay absolute top-0 opacity-75 bg-white p-4 w-full h-full hidden parent-hover:show-card">
        <div className="item__meta">
          <h4 className="text-gray-900 text-left font-bold text-xl mb-2">
            {item.alt_description}
          </h4>

          <div className="flex items-center">
            <div className="text-sm text-left">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
