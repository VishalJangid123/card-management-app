import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import Details from '../screens/AddCard';
import Overview from '../screens/CardList';
import { CustomerProvider } from 'context/CustomerContext';
import CustomerList from 'screens/CustomerList';

export type RootStackParamList = {
  CustomerList: undefined;
  CardList: undefined;
  AddCard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
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
