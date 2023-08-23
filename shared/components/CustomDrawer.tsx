import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Linking, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.green,
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Help"
          onPress={() => Linking.openURL('https://quadri.com.ar')}
        />
        <DrawerItem
          label="Chat2"
          onPress={() => props.navigation.navigate('Chat')}
        />
      </DrawerContentScrollView>
    </View>
  );
};
