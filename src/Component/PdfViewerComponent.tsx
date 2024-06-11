import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';

interface PdfViewerComponentProps {
  uri: string;
  fileName: string;
}

const PdfViewerComponent: React.FC<PdfViewerComponentProps> = ({
  uri,
  fileName,
}) => {
  return (
    <View style={styles.container}>
      <Text>{fileName}</Text>
      <Pdf
        trustAllCerts={false}
        source={{uri}}
        style={styles.pdf}
        onError={error => {
          console.log('Failed to load PDF', error);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8, // Adjusted height to fit in modal
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 40, // Adjust to fit within modal padding
    height: Dimensions.get('window').height * 0.8, // Adjusted height to fit in modal
  },
});

export default PdfViewerComponent;
