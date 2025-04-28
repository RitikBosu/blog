import React, { useState, useEffect, useContext } from 'react';
import { getAllTopics } from '../../services/topicService';
import { AuthContext } from '../../contexts/AuthContext';
import TopicForm from './TopicForm';
import TopicCard from './TopicCard';
import { 
  FaPlus, 
  FaBookOpen, 
  FaExclamationTriangle, 
  FaSyncAlt, 
} from 'react-icons/fa';
import './TopicList.css';

// Icon mapping using public assets
const ICON_MAPPINGS = {
  'React Fundamentals': '/assets/images/react-icon.png',
  'JavaScript Basics': '/assets/images/js-icon.png',
  'Web APIs': '/assets/images/api-icon.png',
  'CSS and Styling': '/assets/images/css-icon.png'
};

const TopicsList = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const topicsData = await getAllTopics();
      
      // Add iconUrl to each topic
      const topicsWithIcons = topicsData.map(topic => ({
        ...topic,
        iconUrl: topic.iconUrl || ICON_MAPPINGS[topic.name] || '/assets/images/default-profile.png'
      }));
      
      setTopics(topicsWithIcons);
      setError(null);
    } catch (err) {
      setError('Failed to load topics. Please try again later.');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicAdded = (newTopic) => {
    setTopics([...topics, newTopic]);
    setShowAddForm(false);
  };

  const handleDelete = async (topicId) => {
    try {
      // This would be replaced with an actual API call
      setTopics(topics.filter(topic => topic.id !== topicId));
    } catch (err) {
      setError('Failed to delete topic. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h3>Loading educational resources...</h3>
        <p>Please wait while we retrieve the topics</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <FaExclamationTriangle size={48} />
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => fetchTopics()} className="retry-btn">
          <FaSyncAlt size={22} /> Try Again
        </button>
      </div>
    );
  }

  // If showing add form, render the form
  if (showAddForm) {
    return (
      <TopicForm 
        onCancel={() => setShowAddForm(false)}
        onTopicAdded={handleTopicAdded}
      />
    );
  }

  return (
    <div className="topics-container">
      <div className="topics-header">
        <div className="topics-title">
          <h1>Educational Resources</h1>
          <div className="title-decoration"></div>
        </div>
        {user && user.isFacilitator && (
          <button 
            className="add-topic-btn"
            onClick={() => setShowAddForm(true)}
            aria-label="Add new topic"
          >
            <FaPlus size={22} /> Add New Topic
          </button>
        )}
      </div>
      
      <p className="topics-intro">
        Browse through our collection of educational resources by topic. Click on a topic to view all available resources.
      </p>
      
      {topics.length === 0 ? (
        <div className="no-topics">
          <div className="empty-state-image">
            <FaBookOpen size={100} />
          </div>
          <h3>No topics available yet</h3>
          <p>Be the first to create a topic for educational resources!</p>
          {user && user.isFacilitator && (
            <button 
              className="create-first-topic-btn"
              onClick={() => setShowAddForm(true)}
            >
              Create First Topic
            </button>
          )}
        </div>
      ) : (
        <div className="topics-grid">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              isAdmin={user && user.isFacilitator}
              onDelete={() => handleDelete(topic.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicsList;