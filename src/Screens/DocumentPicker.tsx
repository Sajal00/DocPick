import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  HomeTabParamList,
  DocumentPickerScreenNavigationProp,
} from '../Types/type';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import DeleteComp from '../Component/DeleteComp';
import ModalComp from '../Component/ModalComp';
// import ModalComp from '../Component/ModalComp';
type Props = BottomTabScreenProps<HomeTabParamList, 'DocumentPicker'>;
const STORAGE_KEY = 'STORAGE_KEY';

const DocPicker: React.FC<Props> = ({navigation}) => {
  const [selectedDocs, setSelectedDocs] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredDocs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          setSelectedDocs(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Failed to load documents from storage', e);
      }
    };

    loadStoredDocs();
  }, []);

  const storeDocsInAsyncStorage = async (docs: DocumentPickerResponse[]) => {
    try {
      const jsonValue = JSON.stringify(docs);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Stored in AsyncStorage:', jsonValue);
    } catch (e) {
      console.error('Failed to store documents in storage', e);
    }
  };

  const selectDoc = async () => {
    try {
      const docs: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [types.pdf, types.images],
        allowMultiSelection: true,
      });
      const updatedDocs = selectedDocs.concat(docs);
      setSelectedDocs(updatedDocs);
      storeDocsInAsyncStorage(updatedDocs);
      console.log('Selected documents:', updatedDocs);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the upload', err);
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const copyFileToInternalStorage = async (uri: string, fileName: string) => {
    try {
      const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(uri, destinationPath);

      return destinationPath;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  };

  const uploadFiles = async () => {
    if (selectedDocs.length === 0) {
      return Alert.alert('Please select at least one file');
    }
    setLoading(true);
    const fileUploadResults: {fileName: string | null; downloadUrl: string}[] =
      [];

    const uploadPromises = selectedDocs.map(async doc => {
      try {
        // Copy file to internal storage
        const internalPath = await copyFileToInternalStorage(doc.uri, doc.name);

        const reference = storage().ref(`/myfiles/${doc.name}`);
        const task = reference.putFile(internalPath);

        task.on('state_changed', taskSnapshot => {
          setProgress(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });

        await task;
        const downloadUrl = await reference.getDownloadURL();
        fileUploadResults.push({fileName: doc.name, downloadUrl});
        navigation.navigate('Documents', {files: fileUploadResults});
        console.log('all download link', downloadUrl);
      } catch (error) {
        console.error('Error during file upload:', error);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      Alert.alert('Files uploaded successfully!');
      console.log('Download URLs:', fileUploadResults);
      setProgress('');
    } catch (error) {
      console.error('Error uploading files:', error);
      Alert.alert('Error uploading files', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDataItem = (item: DocumentPickerResponse, index: number) => {
    if (item.type && item.type.startsWith('image/')) {
      return (
        <View
          // onPress={() => handleModalcomp(item, index)}
          key={index}
          style={styles.item}>
          <Image source={{uri: item.uri}} style={styles.image} />
          <DeleteComp onDeletePress={() => handleDeleteItem(index)} />
        </View>
      );
    } else if (item.type && item.type === 'application/pdf') {
      return (
        <View
          // onPress={() => handleModalcomp(item, index)}
          key={index}
          style={styles.pdfviw}>
          <Image
            style={styles.pdfimage}
            source={{
              uri: 'https://downloadr2.apkmirror.com/wp-content/uploads/2019/12/5de9caa9b39f0.png',
            }}
          />
          <Text>{item.name}</Text>
          <DeleteComp onDeletePress={() => handleDeleteItem(index)} />
        </View>
      );
    } else {
      return null;
    }
  };

  const handleDataShow = () => {
    return (
      <ScrollView
        style={{padding: 10, height: '80%', width: '100%', marginBottom: 10}}
        showsVerticalScrollIndicator={false}>
        {selectedDocs.map((item, index) => renderDataItem(item, index))}
      </ScrollView>
    );
  };

  const handleDeleteItem = (index: number) => {
    const updatedDocs = selectedDocs.filter((_, i) => i !== index);
    setSelectedDocs(updatedDocs);
    storeDocsInAsyncStorage(updatedDocs);
    console.log('Deleted document at index:', index);
  };

  // const handleModalcomp = (item: DocumentPickerResponse, index: number) => {
  //   setCurrentImage(item);
  //   setIsModalVisible(true);
  // };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Select files" onPress={selectDoc} />
        <Button title="Upload files" onPress={uploadFiles} disabled={loading} />
      </View>
      {selectedDocs.length > 0 && handleDataShow()}
      {isModalVisible && (
        <ModalComp
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          content={currentImage}
        />
      )}

      {loading && <Text>Uploading... {progress}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  pdfviw: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
    marginBottom: 10,
    elevation: 2,
  },

  image: {
    width: '95%',
    height: '95%',
    resizeMode: 'cover',
  },
  pdfimage: {
    width: '60%',
    height: '90%',
    resizeMode: 'center',
    borderColor: 'red',
  },
});

export default DocPicker;
