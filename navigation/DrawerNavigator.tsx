import { createDrawerNavigator } from '@react-navigation/drawer';
import { FoodLog, Goals, Plans } from '../screens';
import { Chat } from '../screens';

const Drawer = createDrawerNavigator();

const ChatDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Food Log" component={FoodLog} />
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Plans" component={Plans} />
    </Drawer.Navigator>
  );
};

export default ChatDrawerNavigator;
