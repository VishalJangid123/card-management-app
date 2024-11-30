import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';

import { RootStackParamList } from '../navigation';

import React, { useEffect, useState } from 'react';
import useOmise from 'hooks/useOmise';
import { Feather } from '@expo/vector-icons';
import { getBrandLogo } from 'Constants/GetBrandLogo';
import CustomModal from 'components/CustomModal';
import { Button } from 'components/Button';

import io from 'socket.io-client';
import axios from 'axios';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CardList'>;

export default function Overview({ route }) {
  // Use Custom Hooks
  const { getCardsForCustomer, createCharge, loading } = useOmise();

  const [paymentStatus, setPaymentStatus] = useState({});
  // Navigation
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  useEffect(()=> {
    navigation.setOptions({
      headerShown: false,
    });
  },[])

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchResponse = async () => {
        const res = await getCardsForCustomer(route.params.customerId).then((data) => {
          setAllCards(data);
        });
      };
      fetchResponse();
    }, []))


    useEffect(() => {
      const socket = io(process.env.EXPO_PUBLIC_BACKEND_URL);
      const clientId = route.params.customerId
      socket.emit('subscribe', clientId);

      socket.on('paymentStatusUpdate', (status) => {
        console.log("status",status)  
        setPaymentStatus(status);
      });

      return () => {
          socket.disconnect();
      };
  }, []);


  // Function
  const handlePayment = async () => {
    const result = await createCharge(route.params.customerId, randomAmount * 100);
  };

  const randomizeAmount = (min, max) => {
    setRandomAmount(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  return (
    <SafeAreaView>
      <View className="flex-auto gap-5 p-5">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Cards</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddCard', { params: route.params.customerId })}>
            <Feather name="plus" size={30} />
          </TouchableOpacity>
        </View>

        {cards && cards.length > 0 ? (
          <View className='h-full justify-between'>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View className="flex h-full gap-5">
            <ScrollView 
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1, gap: 20, paddingBottom: 160 }}>
              {cards.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCardForPayment(item);
                    setShowPayModal(true);
                  }}
                  key={index}
                  className="elevation-xl h-52 w-full gap-3 rounded-xl bg-white p-9 shadow shadow-gray-300">
                  <Image className="h-5 w-16" source={getBrandLogo(item.brand)} />
                  <View className="mb-2 flex-row gap-5">
                    <Text className="text-2xl font-bold text-c-gray-1">••••</Text>
                    <Text className="text-2xl font-bold text-c-gray-1">••••</Text>
                    <Text className="text-2xl font-bold text-c-gray-1">••••</Text>
                    <Text className="text-2xl text-c-gray-1">{item.last_digits}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <View className="gap-5">
                      <Text className="text-c-gray-2 text-xs">Name on Card</Text>
                      <Text className="text-sm font-bold">{item.name}</Text>
                    </View>
                    <View className="gap-5">
                      <Text className="text-c-gray-2 text-xs">Expires</Text>
                      <Text className="text-sm font-bold">
                        {item.expiration_month}/{item.expiration_year}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          </ScrollView>
            <View className="
            bottom-20
            absolute left-1/2 z-10 -translate-x-1/2 transform  rounded-full p-4 text-white ">
            <Button
              onPress={() => setShowPayModal(true)}
              className="flex w-80 content-center items-center justify-center"
              title="Pay"
            />
          </View>
          </View>

        ) : (
          // No cards
          <View className="h-[90%] items-center justify-center gap-5">
            <Text className='text-4xl'>💳</Text>
            <Text className='text-lg'>No Cards found.</Text>
            <Text className='text-lg text-center'>We recommend adding a card {"\n"} for easy payment.</Text>
            <TouchableOpacity
              className=""
              onPress={() => navigation.navigate('AddCard', { params: route.params.customerId })}>
              <Text className="text-xl font-bold text-primary">Add new card</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
        {/* Modal for paying */}
      <CustomModal isVisible={showPayModal} height="h-[50%]" onClose={() => { setShowPayModal(false); setPaymentStatus({})}}>
        <TouchableOpacity
          onPress={() => { setShowPayModal(false); setPaymentStatus({})} }
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

          {paymentStatus !== undefined && (
            <Text
              className={`
                mt-5 text-center font-bold text-lg
                ${paymentStatus.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
               {paymentStatus.status && "Payment " + paymentStatus.status }
            </Text>
            )}
            {
              paymentStatus !== undefined &&
              paymentStatus.status === 'success' ?
              <Text className='text-center'>{paymentStatus.amount} from **** **** **** {paymentStatus.lastDigits} ( {paymentStatus.chargeId} ) </Text> :
              <Text className='text-center'>{paymentStatus.status}</Text>
            }
          
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
