import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTopicById } from '../../services/topicService';
import { getResourcesByTopic } from '../../services/resourceService';
import { AuthContext } from '../../contexts/AuthContext';
import ResourceList from '../resources/ResourceList';
import { FaUpload } from 'react-icons/fa';
import './TopicDetail.css';

const TopicDetail = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopicAndResources = async () => {
      try {
        setLoading(true);
        const [topicData, resourcesData] = await Promise.all([
          getTopicById(topicId),
          getResourcesByTopic(topicId)
        ]);
        
        setTopic(topicData);
        setResources(resourcesData);
        setError(null);
      } catch (err) {
        setError('Failed to load topic data. Please try again later.');
        console.error('Error fetching topic details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndResources();
  }, [topicId]);

  const handleUploadClick = () => {
    // Navigate to upload page with topic ID in the URL
    navigate(`/upload?topicId=${topicId}`);
  };

  if (loading) {
    return <div className="loading-container">Loading topic resources...</div>;
  }

  if (error || !topic) {
    return (
      <div className="error-container">
        <p>{error || 'Topic not found'}</p>
        <Link to="/" className="back-link">Return to Home</Link>
      </div>
    );
  }

  // Function to get the correct image URL
  const getImageUrl = () => {
    // If topic has iconUrl property, use that directly
    if (topic.iconUrl) {
      return topic.iconUrl;
    }
    
    // If topic has icon property (old format), prepend the path
    if (topic.icon) {
      return `/assets/images/${topic.icon}`;
    }
    
    // Default fallback
    return '/assets/images/default-icon.png';
  };

  return (
    <div className="topic-detail-container">
      <div className="topic-header">
        <Link to="/" className="back-button">← Back to Topics</Link>
        <div className="topic-header-content">
          <div className="topic-header-icon">
            <img 
              src={getImageUrl()} 
              alt={topic.name}
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
                e.target.onerror = null;
                e.target.src = '/assets/images/default-icon.png';
              }}
            />
          </div>
          <div className="topic-header-info">
            <h1>{topic.name}</h1>
            <p>{topic.description}</p>
          </div>
        </div>
      </div>
      
      <div className="topic-resources">
        <div className="resources-header">
          <h2>Available Resources</h2>
          {user && user.isFacilitator && (
            <button 
              className="upload-resource-btn" 
              onClick={handleUploadClick}
            >
              <FaUpload size={24} /> Upload Resource
            </button>
          )}
        </div>
        
        {resources.length > 0 ? (
          <ResourceList resources={resources} />
        ) : (
          <div className="no-resources">
            <p>No resources available for this topic yet.</p>
            {user && user.isFacilitator && (
              <button 
                className="upload-first-resource-btn"
                onClick={handleUploadClick}
              >
                Upload First Resource
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;