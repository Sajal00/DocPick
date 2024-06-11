import {StyleSheet, Dimensions} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const Dockpick = StyleSheet.create({
  // Documentpicker
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight / 4,
    width: deviceWidth,
    borderWidth: 0.4,
  },
  Maincontainer: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  pdfImageviw: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight / 4,
    width: deviceWidth,
    marginBottom: 10,
  },

  image: {
    width: '70%',
    height: '70%',
    resizeMode: 'cover',
  },
  pdfimage: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  Scrollviewstye: {
    padding: 10,
    height: '80%',
    width: '100%',
    marginBottom: 10,
  },
  // Document
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
  Docimage: {
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
  docpdfimage: {
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
    borderWidth: 0.1,
  },
});
export default Dockpick;
