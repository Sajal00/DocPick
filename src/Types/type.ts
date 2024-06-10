// types.ts
import {RouteProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type HomeTabParamList = {
  DocumentPicker: undefined;
  Documents: undefined;
};

export type DocumentPickerScreenNavigationProp = BottomTabNavigationProp<
  HomeTabParamList,
  'DocumentPicker'
>;

export type DocumentsScreenNavigationProp = BottomTabNavigationProp<
  HomeTabParamList,
  'Documents'
>;
