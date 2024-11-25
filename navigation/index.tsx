import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { BackButton } from '../components/BackButton';
import Details from '../screens/AddCard';
import Overview from '../screens/CardList';

export type RootStackParamList = {
  CardList: undefined;
  AddCard: { name: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CardList">
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
  );
}
