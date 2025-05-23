import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  LogScreen,
  ProgressScreen,
  Profile,
  Chat,
  WeightScreen,
  HeightScreen,
  BirthdateScreen,
  GenderScreen,
} from '@screens';
import { CustomDrawer } from '@components';
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
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen
        name="EditWeight"
        component={WeightScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditHeight"
        component={HeightScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditBirthdate"
        component={BirthdateScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditGender"
        component={GenderScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};
