import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigation';

import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import useOmise from 'useOmise';
import { Feather } from '@expo/vector-icons';
import { getBrandLogo } from 'Constants/GetBrandLogo';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CardList'>;

export default function Overview({ route }) {
  // Use Custom Hooks
  const { getCardsForCustomer } = useOmise();

  // Navigation
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  navigation.setOptions({
    headerShown: false,
  });

  // State
  const [cards, setAllCards] = useState([]);

  // Hooks
  useEffect(() => {
    const params = route.params;
    if (params.customerId) {
      const fetchResponse = async () => {
        const res = await getCardsForCustomer(params.customerId).then((data) => {
          setAllCards(data);
          console.log('CARDS', cards);
        });
      };
      fetchResponse();
    } else console.log('No customer params recv.');
  }, []);

  return (
    <SafeAreaView>
      <View className="gap-5 p-5">
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
        {cards !== undefined ? (
          <View className="flex h-full gap-5">
            <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 20 }}>
              {cards.map((item, index) => (
                <View
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
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="h-[90%] items-center justify-center">
            <Text>No Cards found.</Text>
            <Text>We recommend adding card for easy payment</Text>
            <TouchableOpacity
              className=""
              onPress={() => navigation.navigate('AddCard', { params: route.params.customerId })}>
              <Text className="text-primary text-xl font-bold">Add new card</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
