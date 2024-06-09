import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import DeleteComp from '../Component/DeleteComp';
import ModalComp from '../Component/ModalComp';

const DocPicker: React.FC = () => {
  const [selectedDocs, setSelectedDocs] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const StoreDatainAsyncStorage = async (doc: DocumentPickerResponse[]) => {
    try {
      const jsonValue = JSON.stringify(doc);
      await AsyncStorage.setItem('STORAGE_KEY', jsonValue);
      console.log('stored in async ', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const selectDoc = async () => {
    try {
      const doc: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [types.pdf, types.images, types.docx],
        allowMultiSelection: true,
      });
      const updateddoc = selectedDocs?.concat(doc);
      // console.log('Selected documents:', updateddoc);

      setSelectedDocs(updateddoc);
      // await AsyncStorage.setItem('STORAGE_KEY', JSON.stringify(updateddoc));
      // StoreDatainAsyncStorage(updateddoc);

      // You can use the `doc` object to perform further actions
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the upload', err);
      } else {
        console.log('Error picking document:', err);
      }
    }
  };

  const renderDataItem = (item: DocumentPickerResponse, index: number) => {
    if (item.type && item.type.startsWith('image/')) {
      return (
        <TouchableOpacity
          key={index}
          style={styles.item}
          // onPress={() => console.log('clicked in index', index)}>
          onPress={() => handleModalcomp(item, index)}>
          <Image source={{uri: item.uri}} style={styles.image} />
          <DeleteComp onDeletePress={() => HandleDeleteItem(index)} />
        </TouchableOpacity>
      );
    } else if (item.type && item.type === 'application/pdf') {
      return (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => handleModalcomp(item, index)}>
          <Text>📄</Text>
          <Text>{item.name}</Text>
          <DeleteComp onDeletePress={() => HandleDeleteItem(index)} />
        </TouchableOpacity>
      );
    } else {
      return null; // Skip rendering if the type is not recognized
    }
  };

  const handleDataShow = () => {
    return (
      <ScrollView
        style={{padding: 10, height: '80%', width: '100%', marginBottom: 10}}
        showsVerticalScrollIndicator={false}>
        {selectedDocs.map((item: any, index: any) =>
          renderDataItem(item, index),
        )}
      </ScrollView>
    );
  };

  const HandleDeleteItem = (index: number) => {
    const afterdeletedDocs = selectedDocs.filter((_, i) => i !== index);
    setSelectedDocs(afterdeletedDocs);

    console.log('Deleted document at index:', index);
  };
  const handleModalcomp = (item: any, index: number) => {
    setCurrentImage(item);
    setIsModalVisible(true);
    // console.log('image open ', item.uri);
    // console.log('image open at index ', index);
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Select file" onPress={selectDoc} />
      </View>
      {selectedDocs.length > 0 && handleDataShow()}
      {isModalVisible && (
        <ModalComp
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          content={currentImage}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
    marginBottom: 10,
    elevation: 2,
    // backgroundColor: 'red',
  },
  image: {
    width: '95%',
    height: '95%',
    resizeMode: 'cover',
  },
});

export default DocPicker;
