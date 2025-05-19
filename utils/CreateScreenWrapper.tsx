import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function createScreenWrapper<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList,
  ComponentProps extends ParamList[RouteName] & { onBack: () => void },
>(Component: React.ComponentType<ComponentProps>) {
  return () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
    const route = useRoute<RouteProp<ParamList, RouteName>>();
    const params = route.params || ({} as ParamList[RouteName]);

    return (
      <Component
        {...(params as ComponentProps)}
        onBack={() => navigation.goBack()}
      />
    );
  };
}
