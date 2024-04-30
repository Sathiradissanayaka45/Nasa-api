// MediaDisplay.js

import React from 'react';
import './MediaDisplay.css'; // Import custom CSS for MediaDisplay styling

const MediaDisplay = ({ mediaType, mediaUrl }) => {
  const renderMedia = () => {
    if (mediaType === 'image') {
      return <img src={mediaUrl} alt="Media" className="media-image" />;
    } else if (mediaType === 'video') {
      return (
        <video controls className="media-video">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaType === '3d') {
      return (
        <iframe
          title="3D Model"
          src={mediaUrl}
          className="media-3d"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    }
    return null;
  };

  return <div className="media-container">{renderMedia()}</div>;
};

export default MediaDisplay;
