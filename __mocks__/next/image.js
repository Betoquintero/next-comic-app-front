import * as React from 'react';

const NextImage = ({ src, alt }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} />;
};

export default NextImage;
