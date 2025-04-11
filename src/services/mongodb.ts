
import { Resource } from '@/types/resource';

// MongoDB connection URI - this should be stored in an environment variable in production
const MONGODB_URI = 'mongodb://localhost:27017/studypoint';

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // In a real implementation, you would use a MongoDB client library like mongodb or mongoose
    // This is just a placeholder for demonstration purposes
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Resource CRUD operations
export const getResources = async (): Promise<Resource[]> => {
  try {
    // For now, we'll return the mock data
    // In a real implementation, this would fetch data from MongoDB
    return JSON.parse(localStorage.getItem('resources') || '[]');
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  try {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    return resources.find((r: Resource) => r.id === id) || null;
  } catch (error) {
    console.error(`Failed to fetch resource with id ${id}:`, error);
    return null;
  }
};

export const createResource = async (resource: Omit<Resource, 'id' | 'uploadDate'>): Promise<Resource> => {
  try {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const newResource = {
      ...resource,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    resources.push(newResource);
    localStorage.setItem('resources', JSON.stringify(resources));
    
    return newResource;
  } catch (error) {
    console.error('Failed to create resource:', error);
    throw error;
  }
};

export const updateResource = async (id: number, updates: Partial<Resource>): Promise<Resource | null> => {
  try {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const index = resources.findIndex((r: Resource) => r.id === id);
    
    if (index === -1) {
      return null;
    }
    
    resources[index] = { ...resources[index], ...updates };
    localStorage.setItem('resources', JSON.stringify(resources));
    
    return resources[index];
  } catch (error) {
    console.error(`Failed to update resource with id ${id}:`, error);
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const filteredResources = resources.filter((r: Resource) => r.id !== id);
    
    localStorage.setItem('resources', JSON.stringify(filteredResources));
    
    return true;
  } catch (error) {
    console.error(`Failed to delete resource with id ${id}:`, error);
    return false;
  }
};
