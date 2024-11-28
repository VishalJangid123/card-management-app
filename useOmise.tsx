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

type OmiseCard = {
  id: string;
  last_digits: string;
  brand: string;
};

type OmiseCardToken = {
  id: string;
  card: {
    brand: string;
    last_digits: string;
  };
};

const publicKey = process.env.EXPO_PUBLIC_OMISE_PUBLIC_KEY;
const secretKey = process.env.EXPO_PUBLIC_OMISE_SECRET_KEY;

const useOmise = () => {
  const { addCustomer } = useCustomer();
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

  const getCardsForCustomer = async (customerId): Promise<OmiseCard[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OmiseResponse<OmiseCard[]>>(
        `https://api.omise.co/customers/${customerId}/cards`,
        {
          auth: {
            username: secretKey,
            password: '',
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCardTokenAndAttachToCustomer = async (
    name: string,
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cardCvc: string,
    customerId: string
  ): Promise<OmiseCardToken> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<OmiseResponse<OmiseCardToken>>(
        'https://vault.omise.co/tokens',
        {
          card: {
            name: name,
            number: cardNumber,
            expiration_month: expiryMonth,
            expiration_year: expiryYear,
            security_code: cardCvc,
          },
        },
        {
          auth: {
            username: publicKey,
            password: '',
          },
        }
      );
      const tokenId = response.data.id;
      const url = `https://api.omise.co/customers/${customerId}`;
      const result = await axios.patch(
        url,
        { card: tokenId },
        {
          auth: {
            username: secretKey,
            password: '',
          },
        }
      );

      // Attach to customer
      return result.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCharge = async (customerId: string, amount: Number): Promise<OmiseCardToken> => {
    setLoading(true);
    setError(null);
    try {
      try {
        const paymentResponse = await axios.post(
          'http://localhost:3000/create-charge', // Replace with your backend server
          {
            amount,
            currency: 'thb',
            customer: customerId,
          }
        );
        return paymentResponse.data;
      } catch (err) {
        setError(err.paymentResponse?.data?.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomer,
    getCardsForCustomer,
    createCardToken: createCardTokenAndAttachToCustomer,
    createCharge,
    error,
    loading,
  };
};

export default useOmise;
