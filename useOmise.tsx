import { useState } from 'react';
import axios from 'axios';
import { useCustomer } from './context/CustomerContext';

type OmiseResponse<T> = {
  object: string;
  data: T;
};

type OmiseCustomerResponse = {
  id: string;
  email: string;
};

const publicKey = ''; // Add key
const secretKey = '';

const useOmise = () => {
  const { customer, addCustomer } = useCustomer();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const createCustomer = async (email: string): Promise<OmiseCustomerResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<OmiseResponse<OmiseCustomerResponse>>(
        'https://api.omise.co/customers',
        { email },
        {
          auth: {
            username: secretKey,
            password: '',
          },
        }
      );
      addCustomer(response.data.id, email);
      return response.data.data;
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomer,
    error,
    loading,
  };
};

export default useOmise;
