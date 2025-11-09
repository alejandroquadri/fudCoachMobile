import { CustomDrawer } from '@components';
import { SubscriptionWatcher } from '@hooks';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Chat, LogScreen, ProgressScreen } from '@screens';
import { ConfigStack } from '@screens/config-stack/ConfigStack';
import { PayWallWrapper } from '@screens';
import { DrawerParamList } from '@types';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  return (
    <>
      <SubscriptionWatcher />
      <Drawer.Navigator
        initialRouteName="Chat"
        drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen name="Chat" component={Chat} />
        <Drawer.Screen name="MealLogs" component={LogScreen} />
        <Drawer.Screen name="Progress" component={ProgressScreen} />
        <Drawer.Screen
          name="ConfigStack"
          component={ConfigStack}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="Paywall"
          component={PayWallWrapper}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </>
  );
};
