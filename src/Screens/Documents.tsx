import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeTabParamList, DocumentsScreenNavigationProp} from '../Types/type';
import ModalComp from '../Component/ModalComp';
import Dockpick from '../StyleComponent.tsx/StyleComponent';

type Props = BottomTabScreenProps<HomeTabParamList, 'Documents'>;

const Documents: React.FC<Props> = ({route}) => {
  const {files} = route.params;
  const [selecteduploaditem, setSelectedUploadItem] = useState([]);
  const [isVisible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('selecteduploaditem:', selecteduploaditem);
  }, [selecteduploaditem]);

  useEffect(() => {
    // Assuming 'files' prop indicates the completion of the upload process.
    if (files && files.length > 0) {
      setLoading(false);
    }
  }, [files]);

  const handleModalComponent = item => {
    setSelectedUploadItem(item);
    setVisible(true);
  };

  const renderItemdata = ({item}) => {
    return (
      <>
        <View style={Dockpick.fileContainer}>
          {item.fileName?.endsWith('.png') ||
          item.fileName?.endsWith('.jpg') ||
          item.fileName?.endsWith('.jpeg') ? (
            <TouchableOpacity
              style={{height: 150, width: '100%'}}
              onPress={() => handleModalComponent(item)}>
              <Image
                source={{uri: item.downloadUrl}}
                style={Dockpick.Docimage}
              />
              <Text>File:{item.fileName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={Dockpick.pdfviw}
              onPress={() => handleModalComponent(item)}>
              <Image
                source={{
                  uri: 'https://downloadr2.apkmirror.com/wp-content/uploads/2019/12/5de9caa9b39f0.png',
                }}
                style={Dockpick.docpdfimage}
              />
              <Text>File: {item.fileName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={Dockpick.container}>
      <Text style={Dockpick.header}>Preview Files:</Text>
      {loading ? (
        <View style={Dockpick.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading files...</Text>
        </View>
      ) : files && files.length > 0 ? (
        <FlatList
          data={files}
          keyExtractor={item => item.fileName ?? ''}
          renderItem={renderItemdata}
        />
      ) : (
        <Text>No files uploaded yet.</Text>
      )}
      <ModalComp
        isVisible={isVisible}
        item={selecteduploaditem}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

export default Documents;
