import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';

interface MyPdfViewerProps {
  contentUri: string;
}

const MyPdfViewer: React.FC<MyPdfViewerProps> = ({contentUri}) => {
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        console.log('URI received:', contentUri);

        const path = await resolveContentUri(contentUri);
        if (path) {
          setFilePath(path);
          console.log('Resolved file path:', path);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [contentUri]);

  const resolveContentUri = async (uri: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'android') {
        // Request read permissions on Android
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Read Storage Permission',
            message: 'App needs access to your storage to read files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Storage permission denied');
        }

        // Use react-native-fs to resolve the content URI to an actual file path
        const statResult = await RNFS.stat(uri);
        return statResult.originalFilepath;
      } else if (Platform.OS === 'ios') {
        // On iOS, the URI might already be a file path
        return uri;
      } else {
        throw new Error('Unsupported platform');
      }
    } catch (error) {
      console.error('resolveContentUri error:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {filePath ? (
          <Pdf
            source={{uri: filePath}}
            trustAllCerts={false}
            style={styles.pdf}
            // Uncomment these for additional logging or handling
            // onLoadComplete={(numberOfPages, filePath) => {
            //   console.log(`Number of pages: ${numberOfPages}`);
            // }}
            // onPageChanged={(page, numberOfPages) => {
            //   console.log(`Current page: ${page}`);
            // }}
            // onError={(error) => {
            //   console.error('PDF rendering error:', error);
            // }}
            // onPressLink={(uri) => {
            //   console.log(`Link pressed: ${uri}`);
            // }}
          />
        ) : (
          <View style={styles.loadingContainer}>
            {/* Placeholder for loading or error message */}
            <Text>Loading PDF...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPdfViewer;
