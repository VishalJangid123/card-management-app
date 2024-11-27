import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import useOmise from 'useOmise';

export default function AddCard({ route }) {
  // Custom Hooks
  const { createCardToken } = useOmise();

  // State
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(true);

  // Helper function to validate each field
  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'cardholderName':
        if (!value.trim()) {
          error = 'Cardholder name is required';
        }
        break;

      case 'cardNumber':
        const cleanedCardNumber = value.replace(/\s+/g, ''); // Remove spaces
        if (!cleanedCardNumber) {
          error = 'Card number is required';
        } else if (!/^\d{16}$/.test(cleanedCardNumber)) {
          error = 'Card number must be 16 digits';
        }
        break;

      case 'expiryDate':
        if (!value.trim()) {
          error = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          error = 'Expiry date must be MM/YY';
        }
        break;

      case 'cvc':
        if (!value.trim()) {
          error = 'CVC is required';
        } else if (!/^\d{3}$/.test(value)) {
          error = 'CVC must be 3 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (name: string, value: string) => {
    if (name === 'cardholderName') setCardholderName(value);
    if (name === 'cardNumber') setCardNumber(value);
    if (name === 'expiryDate') setExpiryDate(value);
    if (name === 'cvc') setCvc(value);

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    if (error == '') {
      setSubmitDisable(false);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    console.log(expiryDate.substring(0, 2));
    console.log('customer', route.params.customerId);
    const tokenResponse = await createCardToken(
      cardholderName,
      cardNumber.replace(/\s+/g, ''),
      expiryDate.substring(0, 2),
      expiryDate.substring(3, 5),
      cvc,
      route.params.params
    );

    if (!tokenResponse) {
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <CustomInput
        label="Name on Card"
        value={cardholderName}
        onChangeText={(text) => handleChange('cardholderName', text)}
        placeholder="Ty Lee"
        error={errors.cardholderName}
      />

      <CustomInput
        label="ATM/Debit/Credit card number"
        value={cardNumber}
        onChangeText={(text) => handleChange('cardNumber', text)}
        placeholder="0000 0000 0000 0000"
        mask="9999 9999 9999 9999"
        keyboardType="numeric"
        error={errors.cardNumber}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomInput
          label="Expiry date"
          value={expiryDate}
          onChangeText={(text) => handleChange('expiryDate', text)}
          placeholder="MM/YY"
          mask="99/99"
          keyboardType="numeric"
          style={{ width: 170 }}
          error={errors.expiryDate}
        />

        <CustomInput
          label="CVV"
          value={cvc}
          onChangeText={(text) => handleChange('cvc', text)}
          placeholder=""
          keyboardType="numeric"
          maxLength={3}
          style={{ width: 170 }}
          error={errors.cvc}
        />
      </View>

      <TouchableOpacity
        className={`$ bg-primary ${submitDisable ? 'opacity-60' : ''}`}
        onPress={onSubmit}
        disabled={submitDisable}
        style={{
          padding: 12,
          borderRadius: 50,
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {isSubmitting ? 'Processing...' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
