import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { RootStackParamList } from '../navigation';

import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import useOmise from 'useOmise';
import { Feather } from '@expo/vector-icons';
import { getBrandLogo } from 'Constants/GetBrandLogo';
import CustomModal from 'components/CustomModal';
import { Button } from 'components/Button';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CardList'>;

export default function Overview({ route }) {
  // Use Custom Hooks
  const { getCardsForCustomer, createCharge, loading } = useOmise();

  const [paymentStatus, setPaymentStatus] = useState();

  // Navigation
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  navigation.setOptions({
    headerShown: false,
  });

  // State
  const [cards, setAllCards] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCardForPayment, setSelectedCardForPayment] = useState();
  const [randomAmount, setRandomAmount] = useState(20);
  // Hooks
  useEffect(() => {
    const params = route.params;
    if (params.customerId) {
      const fetchResponse = async () => {
        const res = await getCardsForCustomer(params.customerId).then((data) => {
          setAllCards(data);
        });
      };
      fetchResponse();
    } else console.log('No customer params recv.');
  }, []);

  // Function
  const handlePayment = async () => {
    const result = await createCharge(route.params.customerId, randomAmount * 100);
    setPaymentStatus(result.charge);
  };

  const randomizeAmount = (min, max) => {
    setRandomAmount(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  return (
    <SafeAreaView>
      <View className="flex gap-5 p-5">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Cards</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="plus" size={30} />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-48 left-1/2 z-10 -translate-x-1/2 transform  rounded-full p-4 text-white shadow-lg ">
          <Button
            onPress={() => setShowPayModal(true)}
            className="flex w-40 content-center items-center justify-center"
            title="Pay"
          />
        </View>

        {cards !== undefined ? (
          <View className="flex h-full gap-5">
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 20 }}>
              {cards.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCardForPayment(item);
                    setShowPayModal(true);
                  }}
                  key={index}
                  className="elevation-xl h-56 w-full gap-3 rounded-xl bg-white p-9 shadow shadow-gray-300">
                  <Image className="h-10 w-20" source={getBrandLogo(item.brand)} />
                  <View className="mb-2 flex-row gap-5">
                    <Text className="text-2xl font-bold text-gray-600">••••</Text>
                    <Text className="text-2xl font-bold text-gray-600">••••</Text>
                    <Text className="text-2xl font-bold text-gray-600">••••</Text>
                    <Text className="text-2xl text-gray-600">{item.last_digits}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <View className="gap-3">
                      <Text className="text-gray-400">Name on Card</Text>
                      <Text className="text-lg font-bold">{item.name}</Text>
                    </View>
                    <View className="gap-3">
                      <Text className="text-gray-400">Expires</Text>
                      <Text className="text-lg font-bold">
                        {item.expiration_month}/{item.expiration_year}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          // No cards
          <View className="h-[90%] items-center justify-center">
            <Text>No Cards found.</Text>
            <Text>We recommend adding card for easy payment</Text>
            <TouchableOpacity
              className=""
              onPress={() => navigation.navigate('AddCard', { params: route.params.customerId })}>
              <Text className="text-xl font-bold text-primary">Add new card</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
        {/* Modal for paying */}
      <CustomModal isVisible={showPayModal} height="h-[50%]" onClose={() => setShowPayModal(false)}>
        <TouchableOpacity
          onPress={() => setShowPayModal(false)}
          className="absolute right-10 top-10">
          <Feather name="x" size={25} />
        </TouchableOpacity>
        <View className="mt-10 flex content-center justify-center gap-10 p-5">
          <View className="flex-row justify-center gap-5">
            <Text className="text-center text-lg font-bold">Pay {randomAmount} bht</Text>
            <TouchableOpacity onPress={() => randomizeAmount(20, 1000)}>
              <Feather name="refresh-cw" size={25} />
            </TouchableOpacity>
          </View>
          <Button
            className={`${loading ? 'opacity-40 ' : ''}`}
            title="Pay"
            onPress={() => handlePayment()}></Button>
          {loading && <ActivityIndicator size="large"></ActivityIndicator>}

          {paymentStatus && (
            <Text
              className={`
                mt-5 text-center font-bold
                ${paymentStatus.status === 'successful' ? 'text-green-400' : 'text-red-400'}`}>
              Payment {paymentStatus.status}{' '}
            </Text>
          )}
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
