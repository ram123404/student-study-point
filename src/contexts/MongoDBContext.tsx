
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { connectToMongoDB } from '@/services/mongodb';
import { Resource } from '@/types/resource';
import { MOCK_RESOURCES } from '@/data/mockData';

interface MongoDBContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

const MongoDBContext = createContext<MongoDBContextType>({
  isConnected: false,
  isLoading: true,
  error: null
});

export const useMongoDBContext = () => useContext(MongoDBContext);

interface MongoDBProviderProps {
  children: ReactNode;
}

export const MongoDBProvider = ({ children }: MongoDBProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Initialize local storage with mock data if it doesn't exist
        if (!localStorage.getItem('resources')) {
          console.log('Initializing local storage with mock data');
          localStorage.setItem('resources', JSON.stringify(MOCK_RESOURCES));
        } else {
          console.log('Local storage already initialized');
          console.log('Current resources:', JSON.parse(localStorage.getItem('resources') || '[]'));
        }
        
        // Simulate MongoDB connection
        await connectToMongoDB();
        setIsConnected(true);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to initialize MongoDB:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  const value = {
    isConnected,
    isLoading,
    error
  };

  return (
    <MongoDBContext.Provider value={value}>
      {children}
    </MongoDBContext.Provider>
  );
};
