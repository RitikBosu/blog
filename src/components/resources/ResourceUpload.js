import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { uploadResource } from '../../services/resourceService';
import { getAllTopics } from '../../services/topicService';
import { storage } from '../../firebase/config'; // Import Firebase Storage
import './ResourceUpload.css';

const ResourceUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [file, setFile] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure only facilitators can access this page
    if (!user || !user.isFacilitator) {
      navigate('/login');
      return;
    }

    // Fetch available topics
    const fetchTopics = async () => {
      try {
        const topicsData = await getAllTopics();
        setTopics(topicsData);
        if (topicsData.length > 0) {
          setSelectedTopic(topicsData[0].id);
        }
      } catch (err) {
        setError('Failed to load topics. Please try again later.');
        console.error('Error fetching topics:', err);
      }
    };

    fetchTopics();
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = fileType === 'pdf' ? ['application/pdf'] : ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!validTypes.includes(selectedFile.type)) {
        setError(`Please upload a valid ${fileType.toUpperCase()} file.`);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!title || !description || !selectedTopic) {
      setError('Please fill in all required fields');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    
    try {
      // Upload file to Firebase Storage
      console.log('Uploading file:', file.name);
      const storageRef = storage.ref(`resources/${file.name}`);
      await storageRef.put(file);
      const fileUrl = await storageRef.getDownloadURL();
      console.log('Uploaded fileUrl:', fileUrl);

      // Save resource metadata
      await uploadResource({
        title,
        description,
        fileType,
        fileUrl,
        topicId: parseInt(selectedTopic),
        uploader: {
          id: user.id,
          name: user.name
        },
        uploadDate: new Date().toISOString()
      });
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setFileType('pdf');
      setFile(null);
      
      // Redirect to topic page after a short delay
      setTimeout(() => {
        navigate(`/topics/${selectedTopic}`);
      }, 2000);
      
    } catch (err) {
      setError('Failed to upload resource. Please try again.');
      console.error('Error uploading resource:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Resource</h1>
      
      {error && <div className="upload-error">{error}</div>}
      {success && <div className="upload-success">Resource uploaded successfully! Redirecting...</div>}
      
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Resource Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              required
            >
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="fileType">File Type *</label>
            <select
              id="fileType"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="ppt">PowerPoint</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="file">Upload File *</label>
          <input
            type="file"
            id="file"
            accept={fileType === 'pdf' ? '.pdf' : '.ppt,.pptx'}
            onChange={handleFileChange}
            required
          />
          {file && <div className="file-info">{file.name} ({Math.round(file.size / 1024)} KB)</div>}
        </div>
        
        <div className="upload-info">
          <p>
            <strong>Note:</strong> File will be uploaded as {user?.name} 
            and will include today's date in the filename.
          </p>
        </div>
        
        <button type="submit" className="upload-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Resource'}
        </button>
      </form>
    </div>
  );
};

export default ResourceUpload;