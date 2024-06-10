// Documents.tsx
import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeTabParamList, DocumentsScreenNavigationProp} from '../Types/type';

type Props = BottomTabScreenProps<HomeTabParamList, 'Documents'>;

const Documents: React.FC<Props> = ({route}) => {
  const {files} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploaded Files:</Text>
      {files ? (
        <FlatList
          data={files}
          keyExtractor={item => item.fileName ?? ''}
          renderItem={({item}) => (
            <View style={styles.fileContainer}>
              {item.fileName?.endsWith('.png') ||
              item.fileName?.endsWith('.jpg') ||
              item.fileName?.endsWith('.jpeg') ? (
                <>
                  <Image
                    source={{uri: item.downloadUrl}}
                    style={styles.image}
                  />
                  <Text>File:{item.filename}</Text>
                </>
              ) : (
                <Text style={styles.fileName}>File: {item.fileName}</Text>
              )}
              <Text style={styles.url}>URL: {item.downloadUrl}</Text>
            </View>
          )}
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
  },
  image: {
    width: 100,
    height: 100,
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
});

export default Documents;
