import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomer } from 'context/CustomerContext';
import { useNavigation } from '@react-navigation/native';
import CustomModal from 'components/CustomModal';
import CustomInput from 'components/CustomInput';
import { Button } from 'components/Button';
import { validateEmail } from 'Utils/Validate';
import useOmise from 'hooks/useOmise';
import { Feather } from '@expo/vector-icons';

export default function CustomerList() {
  // Contexts and Hooks
  const { customers, clearAllCustomers } = useCustomer();
  const { createCustomer, loading, error } = useOmise();

  // Navigation and routing
  const navigation = useNavigation();
  useEffect(()=> {
    navigation.setOptions({
      headerShown: false,
    });
  },[])

  

  // States
  const [showAddCustomerModel, setShowAddCustomerModel] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Functions
  const OnAddCustomerButtonClicked = async () => {
    let isValid = validateEmail(customerEmail);
    if (isValid) {
      setEmailError('');
      const customer = await createCustomer(customerEmail);
      setEmailError(error);
      setCustomerEmail('');
    } else {
      setEmailError('Invalid Error');
    }
  };

  const addTestCustomer = () => {
    // This is to add a test customer with email so that we can quickly create customer and add cards
    setCustomerEmail('test@test.com');
    OnAddCustomerButtonClicked();
  };

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
                className="elevation-xl rounded-2xl bg-primary p-3"
                onPress={() => setShowAddCustomerModel(true)}>
                <Text
                  style={{ fontFamily: 'FCSubjectRoundedNoncml-Bold', fontWeight: 100 }}
                  className="font-FC-bold text-center text-xl text-white">
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

          <View className='gap-5'>
            <View>
              <Text className='text-2xl font-bold'>All Customers</Text>
            </View>
          <View className="flex h-full justify-start">
            <ScrollView>
              {customers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('CardList', { customerId: item.id })}
                  className="elevation-lg bg-white p-3">
                  <Text className="text-lg font-bold">{item.email}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          </View>
        )}
      </View>

     
      <TouchableOpacity
        className="elevation-xl absolute bottom-40 left-20 rounded-full bg-primary p-3"
        onPress={() => setShowAddCustomerModel(true)}>
        <Text className="font-FC-bold text-center text-xl font-bold  text-white">
          Add new customer by email
        </Text>
      </TouchableOpacity>

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
