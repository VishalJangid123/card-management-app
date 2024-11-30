import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import CustomInput from '../components/CustomInput';
import useOmise from 'hooks/useOmise';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Button } from 'components/Button';

export default function AddCard({ route }) {
  // Custom Hooks
  const { createCardToken } = useOmise();

  // Navigation
  const navigation = useNavigation();
  useEffect(()=> {
    navigation.setOptions({
      headerShown: false,
    });
  },[])

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
    // Create card token and attach to customer
    const tokenResponse = await createCardToken(
      cardholderName,
      cardNumber.replace(/\s+/g, ''),
      expiryDate.substring(0, 2),
      expiryDate.substring(3, 5),
      cvc,
      route.params.params
    );

    setIsSubmitting(false);
    navigation.navigate('CardList', { customerId: route.params.customerId })
    
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={25} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Add new card</Text>
        <View></View>
      </View>

      <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
        <View>
          <CustomInput
            label="ATM/Debit/Credit card number"
            value={cardNumber}
            onChangeText={(text) => handleChange('cardNumber', text)}
            placeholder="0000 0000 0000 0000"
            mask="9999 9999 9999 9999"
            keyboardType="numeric"
            error={errors.cardNumber}>
            <View className="absolute right-6 top-8 flex-row gap-3">
              <Image className="h-10 w-10" source={require('../assets/visa.png')} />
              <Image className="h-10 w-10" source={require('../assets/mastercard.png')} />
              <Image className="h-10 w-10" source={require('../assets/jcb.png')} />
            </View>
          </CustomInput>
        </View>

        <CustomInput
          label="Name on Card"
          value={cardholderName}
          onChangeText={(text) => handleChange('cardholderName', text)}
          placeholder="Ty Lee"
          error={errors.cardholderName}
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

        <View className="mt-10 flex items-center justify-center">
          <Image className="h-6 w-48" source={require('../assets/secure_payment.png')} />
        </View>

        <View className="flex h-1/2 content-end justify-end">
          <Button
            onPress={() => onSubmit()}
            disabled={submitDisable}
            title={isSubmitting ? 'Processing...' : 'Add'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
