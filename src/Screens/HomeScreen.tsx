import React from 'react';
import DocumentPicker from './DocumentPicker';
import Documents from './Documents';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<HomeTabParamList>();
type HomeTabParamList = {
  DocumentPicker: undefined;
  Documents: undefined;
};
type FilesType = {fileName: string; downloadUrl: string}[];

const HomeScreen: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="DocumentPicker">
      <Tab.Screen name="DocumentPicker" component={DocumentPicker} />
      <Tab.Screen
        name="Documents"
        component={Documents}
        initialParams={{files: [] as FilesType}}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
