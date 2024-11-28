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

const publicKey = ''; // Add key
const secretKey = '';

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
      console.log(err)
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCardToken = async (
    name: string,
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cardCvc: string,
    customerId : string
  ): Promise<OmiseCardToken> => {
    setLoading(true);
    setError(null);
    console.log("create token")
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
      console.log("token", tokenId)
      const url = `https://api.omise.co/customers/${customerId}`
      console.log("URL ",url)
      const result = await axios.patch(
        url,
        {card: tokenId},
        {
          auth: {
            username: secretKey,
            password: '',
          },
        })

      console.log(result.data)
      // Attach to customer
      return result.data;
    } catch (err) {
      console.log(err)
      console.log(err.response)
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCustomer,
    getCardsForCustomer,
    createCardToken,
    error,
    loading,
  };
};

export default useOmise;