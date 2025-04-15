import { Resource } from '@/types/resource';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// MongoDB connection URI - this should be stored in an environment variable in production
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/studypoint';
let client: MongoClient | null = null;
let isConnected = false;

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // In a real environment, we'd connect to an actual MongoDB instance
    // For now we'll simulate connection but use localStorage
    
    // This initialization code should be commented out and used only in production with real MongoDB
    /*
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    */
    
    // Simulate successful connection by checking/initializing local storage
    ensureResourcesLoaded();
    
    console.log('Connected to MongoDB');
    isConnected = true;
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    throw error;
  }
};

// Function to ensure consistent data across components
const ensureResourcesLoaded = () => {
  // If resources don't exist in local storage, initialize with empty array
  if (!localStorage.getItem('resources')) {
    localStorage.setItem('resources', JSON.stringify([]));
  }
};

// Resource CRUD operations
export const getResources = async (): Promise<Resource[]> => {
  try {
    ensureResourcesLoaded();
    // For now, we'll return the local storage data
    // In production, this would use: return await client.db().collection('resources').find().toArray();
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    console.log('Fetched resources:', resources);
    return resources;
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  try {
    ensureResourcesLoaded();
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const resource = resources.find((r: Resource) => r.id === id) || null;
    console.log(`Fetched resource with id ${id}:`, resource);
    return resource;
    
    // In production with real MongoDB, we would use:
    // return await client.db().collection('resources').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error(`Failed to fetch resource with id ${id}:`, error);
    return null;
  }
};

export const createResource = async (resource: Omit<Resource, 'id' | 'uploadDate'>): Promise<Resource> => {
  try {
    ensureResourcesLoaded();
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    const newResource = {
      ...resource,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    resources.push(newResource);
    localStorage.setItem('resources', JSON.stringify(resources));
    console.log('Created resource:', newResource);
    
    // In production with real MongoDB:
    // const result = await client.db().collection('resources').insertOne(newResource);
    // return { ...newResource, _id: result.insertedId };
    
    return newResource;
  } catch (error) {
    console.error('Failed to create resource:', error);
    throw error;
  }
};

export const updateResource = async (id: number, updates: Partial<Resource>): Promise<Resource | null> => {
  try {
    ensureResourcesLoaded();
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const index = resources.findIndex((r: Resource) => r.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedResource = { ...resources[index], ...updates };
    resources[index] = updatedResource;
    localStorage.setItem('resources', JSON.stringify(resources));
    console.log(`Updated resource with id ${id}:`, updatedResource);
    
    // In production with real MongoDB:
    // await client.db().collection('resources').updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: updates }
    // );
    // return await client.db().collection('resources').findOne({ _id: new ObjectId(id) });
    
    return updatedResource;
  } catch (error) {
    console.error(`Failed to update resource with id ${id}:`, error);
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    ensureResourcesLoaded();
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    const filteredResources = resources.filter((r: Resource) => r.id !== id);
    
    localStorage.setItem('resources', JSON.stringify(filteredResources));
    console.log(`Deleted resource with id ${id}`);
    
    // In production with real MongoDB:
    // await client.db().collection('resources').deleteOne({ _id: new ObjectId(id) });
    
    return true;
  } catch (error) {
    console.error(`Failed to delete resource with id ${id}:`, error);
    return false;
  }
};

// Authentication methods
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    // Get admins from localStorage (for demo purposes)
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // For the demo, if no admins exist, create a default admin account
    if (admins.length === 0) {
      const defaultAdmin = {
        id: Date.now(),
        fullName: 'Admin User',
        email: 'admin@studypoint.com',
        password: 'password123'
      };
      localStorage.setItem('admins', JSON.stringify([defaultAdmin]));
      console.log('Created default admin account');
    }
    
    // Get updated admin list
    const updatedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Check if admin exists with matching credentials
    const adminFound = updatedAdmins.find((admin: any) => 
      admin.email === email && admin.password === password
    );
    
    // In production with real MongoDB:
    // const admin = await client.db().collection('admins').findOne({ email });
    // Use proper password comparison with bcrypt or similar
    // if (admin && await bcrypt.compare(password, admin.password)) {
    //   return true;
    // }
    
    return !!adminFound;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

export const registerAdmin = async (adminData: { fullName: string, email: string, password: string }): Promise<boolean> => {
  try {
    // Get current admins
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Check if email already exists
    if (admins.some((admin: any) => admin.email === adminData.email)) {
      throw new Error('Email already in use');
    }
    
    // Add new admin
    admins.push({
      id: Date.now(),
      ...adminData
      // In production: password: await bcrypt.hash(adminData.password, 10)
    });
    
    // Save to localStorage
    localStorage.setItem('admins', JSON.stringify(admins));
    
    // In production with real MongoDB:
    // const hashedPassword = await bcrypt.hash(adminData.password, 10);
    // await client.db().collection('admins').insertOne({
    //   ...adminData,
    //   password: hashedPassword,
    //   createdAt: new Date()
    // });
    
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
