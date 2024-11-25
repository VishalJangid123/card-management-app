import { RouteProp, useRoute } from '@react-navigation/native';
import { ScreenContent } from 'components/ScreenContent';
import { StyleSheet, View } from 'react-native';

import { RootStackParamList } from '../navigation';

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'AddCard'>;

export default function AddCard() {
  const router = useRoute<DetailsSreenRouteProp>();

  return (
    <View style={styles.container}>
      <ScreenContent
        path="screens/details.tsx"
        title={`Showing details for user ${router.params.name}`}
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
