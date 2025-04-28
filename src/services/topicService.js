// COMPLETELY REWRITE THE FILE WITH NO FIREBASE REFERENCES
// Mock topic data service without any external dependencies

// Mock topic data with placeholder icons
const mockTopics = [
  {
    id: '1',
    name: 'React Fundamentals',
    description: 'Learn the core concepts of React, components, props, and state management',
    iconUrl: '/assets/images/react-icon.png',
    createdAt: new Date('2023-12-10'),
    createdBy: '2'
  },
  {
    id: '2',
    name: 'JavaScript Basics',
    description: 'Master the fundamentals of JavaScript programming language',
    iconUrl: '/assets/images/js-icon.png',
    createdAt: new Date('2023-12-12'),
    createdBy: '3'
  },
  {
    id: '3',
    name: 'Web APIs',
    description: 'Explore how to work with various web APIs and integrate them in your applications',
    iconUrl: '/assets/images/api-icon.png',
    createdAt: new Date('2023-12-15'),
    createdBy: '2'
  },
  {
    id: '4',
    name: 'CSS and Styling',
    description: 'Learn modern CSS techniques, layouts, animations, and responsive design',
    iconUrl: '/assets/images/css-icon.png',
    createdAt: new Date('2023-12-18'),
    createdBy: '3'
  }
];

// Get all topics
export const getAllTopics = async () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve([...mockTopics]);
    }, 500);
  });
};

// Get a single topic by ID
export const getTopicById = async (topicId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const topic = mockTopics.find(t => t.id === topicId);
      if (topic) {
        resolve({...topic});
      } else {
        reject(new Error('Topic not found'));
      }
    }, 500);
  });
};

// Create a new topic
export const createTopic = async (topicData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTopic = {
        id: Date.now().toString(),
        ...topicData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTopics.push(newTopic);
      resolve(newTopic);
    }, 500);
  });
};

// Update a topic
export const updateTopic = async (topicId, topicData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTopics.findIndex(t => t.id === topicId);
      if (index !== -1) {
        const updatedTopic = {
          ...mockTopics[index],
          ...topicData,
          updatedAt: new Date()
        };
        mockTopics[index] = updatedTopic;
        resolve(updatedTopic);
      } else {
        reject(new Error('Topic not found'));
      }
    }, 500);
  });
};

// Delete a topic
export const deleteTopic = async (topicId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTopics.findIndex(t => t.id === topicId);
      if (index !== -1) {
        mockTopics.splice(index, 1);
      }
      resolve(true);
    }, 500);
  });
};

// Get topics by facilitator ID
export const getTopicsByFacilitator = async (facilitatorId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTopics = mockTopics.filter(t => t.createdBy === facilitatorId);
      resolve([...filteredTopics]);
    }, 500);
  });
};

// Mock function for icon upload
export const uploadTopicIcon = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fileName = `topic-icon-${Date.now()}.png`;
      const downloadURL = `/assets/images/${fileName}`;
      resolve({ fileName, downloadURL });
    }, 800);
  });
};

// Mock function for icon deletion
export const deleteTopicIcon = async (fileName) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};