import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {StackNavigationProp} from 'react-navigation/native-stack';
import {HomeTabParamList} from '../Types/type'; // Adjust the import path as needed

// Define the props type for the SplashScreen
type SplashScreenProps = {
  navigation: StackNavigationProp<HomeTabParamList, 'SplashScreen'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hi! Welcome to Docpick</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SplashScreen;
