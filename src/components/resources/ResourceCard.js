import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { likeResource } from '../../services/resourceService';
import { db, storage } from '../../firebase/config'; // Firestore db and Storage
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './ResourceCard.css';

const ResourceCard = ({ resource }) => {
  const [currentResource, setCurrentResource] = useState(resource);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [hasLiked, setHasLiked] = useState(resource.hasLiked || false);
  const [downloadError, setDownloadError] = useState(null);
  const { user } = useContext(AuthContext);

  // Format upload date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Icon for file type
  const getFileIcon = (fileType) => {
    return fileType === 'pdf' ? 'pdf-icon.png' : 'ppt-icon.png';
  };

  // Handle like
  const handleLike = async () => {
    if (!user || likeInProgress || hasLiked) return;

    setLikeInProgress(true);
    try {
      const updatedResource = await likeResource(currentResource.id);
      setCurrentResource(updatedResource);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking resource:', error);
    } finally {
      setLikeInProgress(false);
    }
  };

  // Handle download
  const handleDownload = async () => {
    setDownloadError(null);

    try {
      // Validate fileUrl
      if (!currentResource.fileUrl) {
        throw new Error('No file URL provided for this resource.');
      }

      // Log resource details for debugging
      console.log('Resource Details:', {
        resourceId: currentResource.id,
        title: currentResource.title,
        fileUrl: currentResource.fileUrl,
        fileType: currentResource.fileType,
        bucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      });

      // Use Firebase Storage to get download URL
      const storageRef = storage.refFromURL(currentResource.fileUrl);
      const downloadUrl = await storageRef.getDownloadURL();
      console.log('Download URL:', downloadUrl);

      // Create and click download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${currentResource.title}.${currentResource.fileType}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log download if user logged in
      if (user) {
        const downloadRef = doc(db, 'downloads', `${user.uid}_${currentResource.id}`);
        await setDoc(downloadRef, {
          userId: user.uid,
          resourceId: currentResource.id,
          resourceTitle: currentResource.title,
          downloadedAt: serverTimestamp(),
        });
        console.log('Download logged successfully');
      } else {
        console.warn('User not logged in. Skipping download logging.');
      }
    } catch (error) {
      console.error('Error downloading file:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      let errorMessage = 'Failed to download file. Please try again later.';
      if (error.code === 'storage/object-not-found') {
        errorMessage = 'File not found in storage. Please check if the file was uploaded correctly.';
      } else if (error.code === 'storage/unauthorized') {
        errorMessage = 'You do not have permission to access this file. Please log in or contact support.';
      } else if (error.code === 'storage/invalid-url') {
        errorMessage = 'Invalid file URL. Please ensure the file URL is correct.';
      } else if (error.message === 'No file URL provided for this resource.') {
        errorMessage = 'No file URL available for this resource.';
      }
      setDownloadError(errorMessage);
    }
  };

  return (
    <div className="resource-card">
      <div className="resource-card-header">
        <div className="resource-type-icon">
          <img
            src={`/assets/images/${getFileIcon(currentResource.fileType)}`}
            alt={currentResource.fileType}
          />
        </div>
        <h3 className="resource-title">{currentResource.title}</h3>
      </div>

      <p className="resource-description">{currentResource.description}</p>

      <div className="resource-meta">
        <div className="resource-uploader">
          <strong>By:</strong> {currentResource.uploader?.name || 'Unknown'}
        </div>
        <div className="resource-date">
          <strong>Uploaded:</strong> {formatDate(currentResource.uploadDate)}
        </div>
      </div>

      <div className="resource-actions">
        <button
          className="resource-download-btn"
          onClick={handleDownload}
          disabled={!currentResource.fileUrl}
          title={currentResource.fileUrl ? `Download ${currentResource.fileType.toUpperCase()}` : 'No file available'}
        >
          Download {currentResource.fileType.toUpperCase()}
        </button>

        <button
          className={`resource-like-btn ${!user || hasLiked ? 'disabled' : ''}`}
          onClick={handleLike}
          disabled={!user || likeInProgress || hasLiked}
          title={hasLiked ? "You have already liked this" : "Like this resource"}
        >
          <span className={`like-icon ${hasLiked ? 'liked' : ''}`}>♥</span>
          <span className="like-count">{currentResource.likes}</span>
        </button>
      </div>

      {!user && (
        <div className="login-prompt">
          <small>Log in to like this resource</small>
        </div>
      )}

      {downloadError && (
        <div className="download-error">
          <small style={{ color: 'red' }}>{downloadError}</small>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;