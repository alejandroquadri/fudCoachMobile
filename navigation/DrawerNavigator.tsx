import { CustomDrawer } from '@components';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Chat, LogScreen, ProgressScreen, ProfileStack } from '@screens';
import { DrawerParamList } from '@types';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Chat"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="MealLogs" component={LogScreen} />
      <Drawer.Screen name="Progress" component={ProgressScreen} />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
