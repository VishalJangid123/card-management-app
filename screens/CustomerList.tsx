import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useCustomer } from 'context/CustomerContext';
import { useNavigation } from '@react-navigation/native';
import CustomModal from 'components/CustomModal';
import CustomInput from 'components/CustomInput';
import { Button } from 'components/Button';
import { validateEmail } from 'Utils/Validate';
import useOmise from 'useOmise';
import { Feather } from '@expo/vector-icons';

export default function CustomerList() {
  // Contexts and Hooks
  const { customers, clearAllCustomers } = useCustomer();
  const { createCustomer, loading, error } = useOmise();

  // Navigation and routing
  const navigation = useNavigation();
  navigation.setOptions({
    headerShown: false,
  });

  // States
  const [showAddCustomerModel, setShowAddCustomerModel] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Functions
  const OnAddCustomerButtonClicked = async () => {
    console.log(customerEmail);
    let isValid = validateEmail(customerEmail);
    if (isValid) {
      setEmailError('');
      const customer = await createCustomer(customerEmail);
      console.log(customer);
      setEmailError(error);
      setCustomerEmail('');
      // make api call
    } else {
      setEmailError('Invalid Error');
    }
    console.log(isValid);
    console.log(emailError);
  };

  const addTestCustomer = () => {
    console.log('addTestCustomer');
    setCustomerEmail('test@test.com');
    OnAddCustomerButtonClicked();
  };

  console.log(customers);
  return (
    <SafeAreaView>
      {customers.length > 0 && (
        <TouchableOpacity onPress={() => clearAllCustomers()} className="flex-row justify-end p-5">
          <Feather name="trash" size={25} />
        </TouchableOpacity>
      )}

      <View className="p-5">
        {customers.length === 0 ? (
          <View className="flex h-full content-center items-center justify-between gap-7">
            <Text className="p-10 text-lg font-bold">😐 No Customer found.</Text>

            <View className="item-center flex h-[50%] content-center justify-center ">
              <TouchableOpacity
                className="bg-primary elevation-xl rounded-2xl p-3"
                onPress={() => setShowAddCustomerModel(true)}>
                <Text className="text-center text-xl font-bold  text-white">
                  Add new customer by email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="rounded-2xl p-3" onPress={() => addTestCustomer()}>
                <Text className="text-center text-lg font-bold text-gray-600">
                  Add a test customer.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          customers.map((item, index) => (
            <View className="flex h-full justify-start">
              <View className="elevation-lg bg-white p-3">
                <Text className="text-lg font-bold">{item.email}</Text>
              </View>
              <TouchableOpacity
                className="bg-primary elevation-xl absolute bottom-40 left-14 rounded-2xl p-3"
                onPress={() => setShowAddCustomerModel(true)}>
                <Text className="text-center text-xl font-bold  text-white">
                  Add new customer by email
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <CustomModal
        isVisible={showAddCustomerModel}
        height="h-[50%]"
        onClose={() => setShowAddCustomerModel(false)}>
        <View className="flex h-[40%] gap-5 p-5">
          <Text className="text-2xl font-bold">Add new Customer</Text>
          <CustomInput
            placeholder="test@test.com"
            label="Customer's Email"
            value={customerEmail}
            onChangeText={(text) => setCustomerEmail(text)}
          />
          {emailError && emailError.length > 0 && (
            <Text className="item-center font-bold text-red-400">Invalid Email</Text>
          )}
          <Button
            onPress={() => OnAddCustomerButtonClicked()}
            title={loading ? 'Saving' : 'Add'}></Button>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}