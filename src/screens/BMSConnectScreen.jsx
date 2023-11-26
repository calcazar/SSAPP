import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useBluetoothManager from '../hooks/useBluetoothManager'; // Adjust path as needed
import HR from '../components/HR';

const BMSConnectScreen = ({navigation}) => {
  const {devices, scanForDevices, connectToDevice} = useBluetoothManager();

  const handleConnect = device => {
    connectToDevice(device)
      .then(peripheralInfo => {
        console.log('Retrieved peripheral info:', peripheralInfo);
        navigation.navigate('BMS', {deviceId: device.id});
      })
      .catch(error => {
        console.error('Connection error', error);
      });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity onPress={scanForDevices} style={styles.scanButton}>
        <Text>Scan</Text>
      </TouchableOpacity>
      <HR />
      <ScrollView>
        {devices.map((device, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleConnect(device)}
            style={styles.connectButton}>
            <Text>BMS ID: {device.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    paddingTop: 40,
    flex: 1,
  },
  scanButton: {
    alignSelf: 'center',
    width: '80%',
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  connectButton: {
    borderWidth: 1,
    alignSelf: 'center',
    width: '80%',
    padding: 20,
    marginBottom: 30,
  },
});

export default BMSConnectScreen;
