import { createDrawerNavigator } from '@react-navigation/drawer';
import { Goals } from '../screens';
import { Chat } from '../screens';

const Drawer = createDrawerNavigator();


const ChatDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={Chat} 
        />
      <Drawer.Screen name="Goals" component={Goals} />
    </Drawer.Navigator>
  );
}

export default ChatDrawerNavigator;