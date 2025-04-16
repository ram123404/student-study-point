import { Resource } from '@/types/resource';
import { supabase } from '@/lib/supabase';

// Function to connect to Supabase
export const connectToMongoDB = async () => {
  try {
    console.log('Connecting to Supabase...');
    
    // Test connection by making a simple query
    const { data, error } = await supabase
      .from('resources')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error testing Supabase connection:', error);
      throw error;
    }
    
    console.log('Connected to Supabase');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
};

// Resource CRUD operations
export const getResources = async (): Promise<Resource[]> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('uploadDate', { ascending: false });
    
    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
    
    console.log('Fetched resources:', data);
    return data?.map(item => ({
      ...item,
      id: Number(item.id),
      field: item.field || "BCA" // Default to BCA for existing resources
    })) || [];
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return [];
  }
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id.toString())
      .single();
    
    if (error) {
      console.error(`Error fetching resource with id ${id}:`, error);
      return null;
    }
    
    console.log(`Fetched resource with id ${id}:`, data);
    return { 
      ...data, 
      id: Number(data.id),
      field: data.field || "BCA" // Default to BCA for existing resources
    } as Resource;
  } catch (error) {
    console.error(`Failed to fetch resource with id ${id}:`, error);
    return null;
  }
};

export const createResource = async (resource: Omit<Resource, 'id' | 'uploadDate'>): Promise<Resource> => {
  try {
    // Generate a unique ID and add upload date
    const newResource = {
      ...resource,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      field: resource.field || "BCA" // Ensure field is set
    };
    
    const { data, error } = await supabase
      .from('resources')
      .insert(newResource)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
    
    console.log('Created resource:', data);
    return { 
      ...data, 
      id: Number(data.id),
      uploadDate: data.uploadDate || newResource.uploadDate,
      field: data.field || newResource.field
    } as Resource;
  } catch (error) {
    console.error('Failed to create resource:', error);
    throw error;
  }
};

export const updateResource = async (id: number, updates: Partial<Resource>): Promise<Resource | null> => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .update({ ...updates, id: id.toString() })
      .eq('id', id.toString())
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating resource with id ${id}:`, error);
      throw error;
    }
    
    console.log(`Updated resource with id ${id}:`, data);
    return { 
      ...data, 
      id: Number(data.id),
      field: data.field || "BCA" // Default to BCA for existing resources
    } as Resource;
  } catch (error) {
    console.error(`Failed to update resource with id ${id}:`, error);
    throw error;
  }
};

export const deleteResource = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id.toString());
    
    if (error) {
      console.error(`Error deleting resource with id ${id}:`, error);
      throw error;
    }
    
    console.log(`Deleted resource with id ${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete resource with id ${id}:`, error);
    return false;
  }
};

// Authentication methods
export const authenticateAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    // In a real application, you would use Supabase Auth
    // For now, we'll query the admins table directly
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password) // In a real app, use proper password verification
      .single();
    
    if (error || !data) {
      console.error('Authentication error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
};

export const registerAdmin = async (adminData: { fullName: string, email: string, password: string }): Promise<boolean> => {
  try {
    // Check if email already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('id')
      .eq('email', adminData.email)
      .single();
    
    if (existingAdmin) {
      throw new Error('Email already in use');
    }
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the "no rows found" error code
      throw checkError;
    }
    
    // Insert new admin
    const { error } = await supabase
      .from('admins')
      .insert({
        email: adminData.email,
        full_name: adminData.fullName,
        password_hash: adminData.password // In a real app, use proper password hashing
      });
    
    if (error) {
      console.error('Error registering admin:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
