import * as React from 'react';

const NextImage = ({ src, alt, ...rest }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...rest} />;
};

export default NextImage;
