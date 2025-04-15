
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/resource';
import { MOCK_RESOURCES } from '@/data/mockData';

interface MongoDBContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  refreshResources: () => Promise<void>;
}

const MongoDBContext = createContext<MongoDBContextType>({
  isConnected: false,
  isLoading: true,
  error: null,
  refreshResources: async () => {}
});

export const useMongoDBContext = () => useContext(MongoDBContext);

interface MongoDBProviderProps {
  children: ReactNode;
}

export const MongoDBProvider = ({ children }: MongoDBProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initDatabase = async () => {
    try {
      // Check if Supabase tables exist, if not create them
      const { error: tablesError } = await supabase
        .from('resources')
        .select('id')
        .limit(1);

      // If the table doesn't exist or is empty, create it with some initial data
      if (tablesError) {
        console.log('Setting up resources table and initial data in Supabase');
        // In a real implementation, you would create the table via SQL or migrations
        
        // Seed the database with mock data
        for (const resource of MOCK_RESOURCES) {
          await supabase
            .from('resources')
            .insert({
              id: resource.id.toString(),
              title: resource.title,
              description: resource.description,
              type: resource.type,
              subject: resource.subject,
              semester: resource.semester,
              uploadDate: resource.uploadDate,
              fileUrl: resource.fileUrl
            });
        }
      } else {
        console.log('Supabase resources table already exists');
      }

      // Initialize admin users table if needed
      const { error: adminsError } = await supabase
        .from('admins')
        .select('id')
        .limit(1);

      if (adminsError) {
        console.log('Setting up admins table with default admin');
        // Create default admin user
        await supabase
          .from('admins')
          .insert({
            email: 'admin@studypoint.com',
            full_name: 'Admin User',
            password_hash: 'password123' // In a real app, use proper password hashing
          });
      }
      
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to initialize Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  // Function to refresh resources
  const refreshResources = async () => {
    try {
      await initDatabase();
    } catch (err) {
      console.error('Failed to refresh resources:', err);
    }
  };

  const value = {
    isConnected,
    isLoading,
    error,
    refreshResources
  };

  return (
    <MongoDBContext.Provider value={value}>
      {children}
    </MongoDBContext.Provider>
  );
};
