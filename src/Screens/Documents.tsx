import {View, Text, Button, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const STORAGE_KEY = 'STORED_DOCUMENTS';
const Documents = () => {
  const [storedData, setStoredData] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('STORAGE_KEY');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      setStoredData(data);
    } catch (e) {
      console.error('Error reading value:', e);
    }
  };

  const handleAddData = () => {
    const newData = [
      ...storedData,
      {type: 'image/png', uri: 'example.png', name: 'New Image'},
      {type: 'application/pdf', uri: 'example.pdf', name: 'New Document'},
    ];
    setStoredData(newData);
    storedData(newData);
  };

  const renderDataItem = (
    item: {
      type: string;
      uri: any;
      name:
        | string
        | number
        | boolean
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | Iterable<React.ReactNode>
        | null
        | undefined;
    },
    index: React.Key | null | undefined,
  ) => {
    if (item.type && item.type.startsWith('image/')) {
      return (
        <View key={index} style={styles.item}>
          <Image source={{uri: item.uri}} style={styles.image} />
          <Text>{item.name}</Text>
        </View>
      );
    } else if (item.type && item.type === 'application/pdf') {
      return (
        <View key={index} style={styles.item}>
          {/* Render PDF icon or any other PDF representation */}
          <Text>📄</Text>
          <Text>{item.name}</Text>
        </View>
      );
    } else {
      return null; // Skip rendering if the type is not recognized
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {storedData !== null ? (
        <View style={styles.container}>
          {storedData.map((item: any, index: any) =>
            renderDataItem(item, index),
          )}
        </View>
      ) : (
        <Text>No data stored yet.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: 200,
    height: 150,
    marginRight: 10,
  },
});

export default Documents;
