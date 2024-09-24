import * as React from 'react';
import Image from 'next/image';


const NextImage = ({ src, alt, width, height, objectFit = 'cover' }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width} 
      height={height} 
      style={{
        objectFit,
      }}
    />
  );
};

export default NextImage;
