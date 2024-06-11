import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeTabParamList, DocumentsScreenNavigationProp} from '../Types/type';
import ModalComp from '../Component/ModalComp';

type Props = BottomTabScreenProps<HomeTabParamList, 'Documents'>;

const Documents: React.FC<Props> = ({route}) => {
  const {files} = route.params;

  const renderItemdata = ({item}) => {
    return (
      <>
        <View style={styles.fileContainer}>
          {item.fileName?.endsWith('.png') ||
          item.fileName?.endsWith('.jpg') ||
          item.fileName?.endsWith('.jpeg') ? (
            <TouchableOpacity style={{height: 150, width: '100%'}}>
              <Image source={{uri: item.downloadUrl}} style={styles.image} />
              <Text>File:{item.fileName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pdfviw}>
              <Image
                source={{
                  uri: 'https://downloadr2.apkmirror.com/wp-content/uploads/2019/12/5de9caa9b39f0.png',
                }}
                style={styles.pdfimage}
              />
              <Text>File: {item.fileName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploaded Files:</Text>
      {files ? (
        <FlatList
          data={files}
          keyExtractor={item => item.fileName ?? ''}
          renderItem={renderItemdata}
        />
      ) : (
        <Text>No files uploaded yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fileContainer: {
    marginVertical: 10,
    height: 180,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    marginBottom: 5,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  url: {
    fontSize: 14,
    color: 'blue',
  },
  pdfimage: {
    width: '80%',
    height: '90%',
    resizeMode: 'contain',
  },
  pdfviw: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 160,
    width: '100%',
    marginBottom: 10,
    borderWidth: 0.2,
  },
});

export default Documents;
