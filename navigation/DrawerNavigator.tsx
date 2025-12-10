import { CustomDrawer } from '@components';
import {
  DrawerToggleButton,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Chat, LogScreen, ProgressScreen, SourcesScreen } from '@screens';
import { ConfigStack } from '@screens/config-stack/ConfigStack';
import { COLORS } from '@theme';
import { DrawerParamList } from '@types';
import { TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Coach"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor={COLORS.accentColor} />,
      }}>
      {/* <Drawer.Screen name="Coach" component={Chat} /> */}
      <Drawer.Screen
        name="Coach"
        component={Chat}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Sources')}
              style={{ paddingRight: 12 }}>
              <Icon
                name="info"
                type="feather"
                size={22}
                color={COLORS.accentColor}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen name="Logs" component={LogScreen} />
      <Drawer.Screen name="Progress" component={ProgressScreen} />
      <Drawer.Screen
        name="ConfigStack"
        component={ConfigStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Sources"
        component={SourcesScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};
