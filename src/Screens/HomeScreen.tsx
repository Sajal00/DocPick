import React from 'react';
import DocumentPicker from './DocumentPicker';
import Documents from './Documents';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

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
      <Tab.Screen
        name="DocumentPicker"
        component={DocumentPicker}
        options={{
          tabBarIcon: () => (
            <FontAwesome6Icon name="file-circle-plus" size={20} color="green" />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        initialParams={{files: [] as FilesType}}
        options={{
          tabBarIcon: () => <Icon name="preview" size={20} color="green" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
