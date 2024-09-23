import * as React from 'react';

const NextImage = ({ src, alt, width, height, objectFit }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        objectFit: objectFit || 'cover',
      }}
    />
  );
};

export default NextImage;
