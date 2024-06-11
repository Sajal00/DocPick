import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import PdfViewerComponent from './PdfViewerComponent';

interface ModalCompProps {
  isVisible: boolean;
  item: any;
  onClose: () => void;
}

const ModalComp: React.FC<ModalCompProps> = ({isVisible, item, onClose}) => {
  const renderDataItem = (item: any) => {
    if (!item) {
      return <Text>No content available</Text>;
    }

    if (
      item.fileName?.endsWith('.png') ||
      item.fileName?.endsWith('.jpg') ||
      item.fileName?.endsWith('.jpeg')
    ) {
      return <Image source={{uri: item.downloadUrl}} style={styles.image} />;
    } else if (
      item.fileName?.endsWith('.pdf') ||
      item.type === 'application/pdf'
    ) {
      return (
        <PdfViewerComponent uri={item.downloadUrl} fileName={item.fileName} />
      );
    } else {
      return <Text>Unknown File Type</Text>;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderDataItem(item)}
          <TouchableOpacity style={styles.buttonClose} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
  },
  modalView: {
    height: '85%',
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20, // Adjust padding to fit better
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20, // Adjust margin for better spacing
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '80%', // Reduced to give space for the button
    resizeMode: 'contain',
    marginBottom: 10, // Spacing between image and button
  },
});

export default ModalComp;
