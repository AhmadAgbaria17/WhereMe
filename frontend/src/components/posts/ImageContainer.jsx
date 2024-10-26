import React, { useState } from 'react'

const ImageContainer = ({images,currentImg,setCurrentImg,onNext,onPrev}) => {
  return (
    <div>
      <div className='image-container' >
        
        {currentImg===0?"":(
          <i onClick={onPrev} class="bi bi-arrow-left arrow"></i>
        )}
        <img
        className='post-item-image' 
        src={images[currentImg].url}
        alt=''
        />
        {currentImg===images.length-1?"":(
          <i onClick={onNext} class="bi bi-arrow-right arrow"></i>
        )}
      
        
      </div>
      <div className='con-img-pagination'>
        {images.map((_,key)=>(
          <i key={key} 
          className=
          {
            currentImg===key?"img-pagination bi bi-circle-fill ":"img-pagination bi bi-circle "
          }
          onClick={()=>setCurrentImg(key)}
          
          ></i>
        
        ))}
      </div>
    </div>
  )
}

export default ImageContainer
