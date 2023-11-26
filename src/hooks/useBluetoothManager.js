import {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import {
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {Buffer} from 'buffer';

const useBluetoothManager = (deviceId, onDataReceived) => {
  const [devices, setDevices] = useState([]);
  const [failedState, setFailedState] = useState(false);
  const [requestInFlight, setRequestInFlight] = useState(false);
  const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

  useEffect(() => {
    BleManager.start({showAlert: false});

    const handleDiscoverPeripheral = peripheral => {
      if (peripheral.name === 'JLS-098') {
        setDevices(oldArray => [...oldArray, peripheral]);
      }
    };

    const discoverListener = DeviceEventEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (!result) {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }
      });
    }

    return () => {
      discoverListener.remove();
    };
  }, []);

  const scanForDevices = () => {
    BleManager.scan([], 5, true).then(() => {
      console.log('Scanning started');
      setTimeout(() => {
        BleManager.stopScan().then(() => {
          console.log('Scan stopped');
          BleManager.getDiscoveredPeripherals([]).then(
            discoveredPeripherals => {
              console.log('Discovered peripherals:', discoveredPeripherals);
              setDevices(
                discoveredPeripherals.filter(
                  device => device.name === 'JLS-098',
                ),
              );
            },
          );
        });
      }, 1000);
    });
  };

  const connectToDevice = device => {
    console.log('Connecting to device', device);

    return BleManager.connect(device.id)
      .then(() => {
        console.log('Connected to ' + device.id);
        // Ensure services are retrieved before resolving the promise
        return BleManager.retrieveServices(device.id);
      })
      .then(() => {
        // Services retrieved successfully
        console.log('Services retrieved for ' + device.id);
      })
      .catch(error => {
        console.error('Connection error', error);
        throw error;
      });
  };

  useEffect(() => {
    const serviceUUID = 'ff00';
    const characteristicUUID = 'ff01';

    const startNotifications = async () => {
      try {
        await BleManager.retrieveServices(deviceId);
        await BleManager.startNotification(
          deviceId,
          serviceUUID,
          characteristicUUID,
        );
        console.log(
          'Notification started for characteristic ' + characteristicUUID,
        );

        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          ({value}) => {
            const receivedData = value
              .map(byte => byte.toString(16).padStart(2, '0'))
              .join('');
            onDataReceived(receivedData);
            setRequestInFlight(false);
          },
        );
      } catch (error) {
        console.error('Notification error', error);
        setFailedState(true);
      }
    };

    if (deviceId) {
      startNotifications();
    }

    return () => {
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    };
  }, [deviceId, onDataReceived]);

  const writeDataToDevice = async () => {
    const serviceUUID = 'ff00';
    const characteristicUUID = 'ff02';
    const dataToSend = Buffer.from([0x24, 0x3a, 0x25]);

    try {
      await BleManager.writeWithoutResponse(
        deviceId,
        serviceUUID,
        characteristicUUID,
        dataToSend.toJSON().data,
      );
      console.log('Data written');
    } catch (error) {
      console.error('Failed to write data to device:', error);
      setFailedState(true);
    }
  };

  const initiateDataRequest = () => {
    if (!requestInFlight && !failedState) {
      setRequestInFlight(true);
      setTimeout(() => {
        writeDataToDevice();
      }, 2000);
    }
  };

  return {
    devices,
    scanForDevices,
    connectToDevice,
    initiateDataRequest,
    failedState,
    setFailedState,
  };
};

export default useBluetoothManager;
