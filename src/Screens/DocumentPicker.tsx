import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Dockpick from '../StyleComponent.tsx/StyleComponent';
import {HomeTabParamList} from '../Types/type';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/MaterialIcons';

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import DeleteComp from '../Component/DeleteComp';

type Props = BottomTabScreenProps<HomeTabParamList, 'DocumentPicker'>;
const STORAGE_KEY = 'STORAGE_KEY';

const DocPicker: React.FC<Props> = ({navigation}) => {
  const [selectedDocs, setSelectedDocs] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');

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

  useEffect(() => {
    Alert.alert('Please Select Files');
  }, []);

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

  const storeDocsInAsyncStorage = async (docs: DocumentPickerResponse[]) => {
    try {
      const jsonValue = JSON.stringify(docs);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Stored in AsyncStorage:', jsonValue);
    } catch (e) {
      console.error('Failed to store documents in storage', e);
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
          const bytesTransferred = taskSnapshot.bytesTransferred;
          const totalBytes = taskSnapshot.totalBytes;
          const percentage = (bytesTransferred / totalBytes) * 100;

          // Rounding to two decimal places
          const percentageRounded = percentage.toFixed(2);

          setProgress(`${percentageRounded}% completed`);
          console.log(`${percentageRounded}% completed`);
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
      setSelectedDocs([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
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
        <View key={index} style={Dockpick.item}>
          <Image source={{uri: item.uri}} style={Dockpick.image} />

          <DeleteComp onDeletePress={() => handleDeleteItem(index)} />
        </View>
      );
    } else if (item.type && item.type === 'application/pdf') {
      return (
        <View key={index} style={Dockpick.pdfImageviw}>
          <Image
            style={Dockpick.pdfimage}
            source={{
              uri: 'https://downloadr2.apkmirror.com/wp-content/uploads/2019/12/5de9caa9b39f0.png',
            }}
          />
          <Text>{item.name}</Text>
          <DeleteComp onDeletePress={() => handleDeleteItem(index)} />
        </View>
      );
    }
  };

  const handleDataShow = () => {
    return (
      <ScrollView
        style={Dockpick.Scrollviewstye}
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

  return (
    <View style={Dockpick.Maincontainer}>
      <View style={Dockpick.buttonContainer}>
        <TouchableOpacity onPress={selectDoc}>
          <MaterialIconsIcon
            name="add-photo-alternate"
            size={40}
            color="orange"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadFiles} disabled={loading}>
          <FontAwesomeIcon name="cloud-upload" size={40} color="skyblue" />
        </TouchableOpacity>
      </View>
      {selectedDocs.length > 0 && handleDataShow()}

      {loading && <Text>Uploading... {progress}</Text>}
    </View>
  );
};

export default DocPicker;
