import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  LogScreen,
  Goals,
  Profile,
  Chat,
  EditWeightScreen,
  EditHeightScreen,
  EditBirthdateScreen,
  EditGenderScreen,
} from '@screens';
import { CustomDrawer } from '@components';
import { DrawerParamList } from '@types';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const ChatDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Chat"
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="MealLogs" component={LogScreen} />
      <Drawer.Screen name="Goals" component={Goals} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen
        name="EditWeight"
        component={EditWeightScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditHeight"
        component={EditHeightScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditBirthdate"
        component={EditBirthdateScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditGender"
        component={EditGenderScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};
