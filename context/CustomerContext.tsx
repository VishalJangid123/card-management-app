import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Customer = {
  id: string;
  email: string;
};

type CustomerContextType = {
  customers: Customer[];
  addCustomer: (id: string, email: string) => void;
  removeCustomer: (id: string) => void;
  clearAllCustomers: () => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('Wrap within CustomerProvider');
  }
  return context;
};

type CustomerProviderProps = {
  children: ReactNode;
};

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customersJson = await AsyncStorage.getItem('customers');
        if (customersJson) {
          setCustomers(JSON.parse(customersJson));
        }
      } catch (error) {
        console.error('Failed to load customers from AsyncStorage', error);
      }
    };

    loadCustomers();
  }, []);

  const saveCustomersToStorage = async (updatedCustomers: Customer[]) => {
    try {
      await AsyncStorage.setItem('customers', JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Failed to save customers to AsyncStorage', error);
    }
  };

  const addCustomer = async (id: string, email: string) => {
    const newCustomer = { id, email };
    const updatedCustomers = [...customers, newCustomer];
    await saveCustomersToStorage(updatedCustomers);
  };

  const removeCustomer = async (id: string) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    await saveCustomersToStorage(updatedCustomers);
  };

  const clearAllCustomers = async () => {
    await AsyncStorage.removeItem('customers');
    setCustomers([]); // Clear the state
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, removeCustomer, clearAllCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
};
