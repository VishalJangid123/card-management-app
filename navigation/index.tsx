import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import Details from '../screens/AddCard';
import Overview from '../screens/CardList';
import { CustomerProvider } from 'context/CustomerContext';
import CustomerList from 'screens/CustomerList';
import { ActivityIndicator, Text } from 'react-native';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export type RootStackParamList = {
  CustomerList: undefined;
  CardList: undefined;
  AddCard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  const [fontsLoaded] = Font.useFonts({
    'FCSubjectRoundedNoncml-Bold': require('../assets/fonts/FC_Subject_Rounded_Bold.otf'),
    FCr: require('../assets/fonts/FC_Subject_Rounded_Regular.otf'),
  });
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'FCSubjectRoundedNoncml-Bold': require('../assets/fonts/FC_Subject_Rounded_Bold.otf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading font', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <CustomerProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CustomerList">
          <Stack.Screen name="CustomerList" component={CustomerList} />
          <Stack.Screen name="CardList" component={Overview} />
          <Stack.Screen
            name="AddCard"
            component={Details}
            options={({ navigation }) => ({
              headerLeft: () => <BackButton onPress={navigation.goBack} />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CustomerProvider>
  );
}
