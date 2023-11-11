import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
} from 'react-native';
import BleManager, {BleManagerModule} from 'react-native-ble-manager';

import useBMSStore from '../stores/BMS';
import HR from '../components/HR';

const BMSConnectScreen = ({navigation}) => {
  const BMSStore = useBMSStore(state => state);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleManager.start({showAlert: false});

    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    const handleDiscoverPeripheral = peripheral => {
      if (peripheral.name === 'JLS-098') {
        setDevices(oldArray => [...oldArray, peripheral]);
      }
    };

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    // Request for permissions in Android
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }

    return () => {
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
    };
  }, []);

  const scanForDevices = () => {
    BleManager.scan([], 5, true).then(() => {
      console.log('Scanning started');
      setDevices([]); // Clear previous results
    });
  };

  const connect = device => {
    // Add your connection logic here
    console.log('Connecting to device', device);
    navigation.navigate('BMS');
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
            onPress={() => connect(device)}
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
