import { CustomDrawer } from '@components';
import {
  DrawerToggleButton,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Chat, LogScreen, ProgressScreen } from '@screens';
import { ConfigStack } from '@screens/config-stack/ConfigStack';
import { COLORS } from '@theme';
import { DrawerParamList } from '@types';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Coach"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerLeft: () => <DrawerToggleButton tintColor={COLORS.accentColor} />,
      }}>
      <Drawer.Screen name="Coach" component={Chat} />
      <Drawer.Screen name="Logs" component={LogScreen} />
      <Drawer.Screen name="Progress" component={ProgressScreen} />
      <Drawer.Screen
        name="ConfigStack"
        component={ConfigStack}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
