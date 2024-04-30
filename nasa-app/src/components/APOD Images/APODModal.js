import React from 'react';
import styles from './APODModal.module.css'; // Import CSS module

const APODModal = ({ isOpen, handleClose, apod }) => {
  if (!isOpen || !apod) return null;

  const isVideo = apod.media_type === 'video';

  const renderMedia = () => {
    if (isVideo) {
      return (
        <div className={styles['modal-video-container']}>
          <iframe
            className={styles['modal-video']}
            src={apod.url}
            title={apod.title}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      );
    } else {
      return <img src={apod.hdurl} alt={apod.title} className={styles['modal-image']} />;
    }
  };

  return (
    <div className={`${styles['modal-overlay']} ${isOpen ? styles['modal-overlay-open'] : ''}`} onClick={handleClose}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>{apod.title}</h2>
          <button className={styles['modal-close-btn']} onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className={styles['modal-body']}>
          {renderMedia()}
          <div className={styles['modal-info']}>
            <p className={styles['modal-date']}>{apod.date}</p>
            <p className={styles['modal-explanation']}>{apod.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APODModal;
