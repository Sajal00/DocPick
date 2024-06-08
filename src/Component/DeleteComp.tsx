import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the props interface
interface DeleteCompProps extends TouchableOpacityProps {
  onDeletePress: () => void;
}

const DeleteComp: React.FC<DeleteCompProps> = ({
  onDeletePress,
  ...restProps
}) => {
  return (
    <TouchableOpacity
      onPress={onDeletePress}
      style={[styles.deleteButton, restProps.style]} // Combine default and passed styles
      {...restProps} // Spread additional props to TouchableOpacity
    >
      <Icon name="delete" size={20} color="red" />
    </TouchableOpacity>
  );
};

// Define default styles for the component
const styles = StyleSheet.create({
  deleteButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 18,
    bottom: 5,
  },
});

export default DeleteComp;
