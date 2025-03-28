import { createDrawerNavigator } from '@react-navigation/drawer';
import { LogScreen, Goals, Profile } from '../screens';
import { Chat } from '../screens';
import { CustomDrawer } from '../components';

const Drawer = createDrawerNavigator();

const ChatDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Chat"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Meal Logs" component={LogScreen} />
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

export default ChatDrawerNavigator;
