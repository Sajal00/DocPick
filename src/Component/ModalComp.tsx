import React, {useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';

interface ModalCompProps {
  isVisible: boolean;
  onClose: () => void;
  content?: string | null; // You can adjust the type as needed
}

const ModalComp: React.FC<ModalCompProps> = ({
  isVisible,
  onClose,
  content,
  ...restProps
}) => {
  useEffect(() => {
    console.log('content', content);
  }, []);

  const renderDataItem = (item?: any) => {
    if (!item) {
      return <Text>No content available</Text>;
    }

    if (item.type.startsWith('image/')) {
      return <Image source={{uri: item.uri}} style={styles.image} />;
    } else if (item.type === 'application/pdf') {
      return <MyPdfViewer contentUri={item.uri} />;
    } else {
      return (
        <View>
          <Text>Unknown File Type</Text>
        </View>
      );
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
          {content ? (
            renderDataItem(content)
          ) : (
            <Text>No content available</Text>
          )}
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={onClose}
            {...restProps}>
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default ModalComp;
