import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContent } from 'components/ScreenContent';
import { StyleSheet, View } from 'react-native';

import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CardList'>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();

  navigation.setOptions({
    headerShown: false
  })

  return (
    <View className='flex-1'>
      <ScreenContent path="screens/overview.tsx" title="Overview" />
      <Button
        onPress={() =>
          navigation.navigate('AddCard', {
            name: 'Dan',
          })
        }
        title="Show Details"
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
