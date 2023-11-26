import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import useBMSStore from '../stores/BMS';
import {PieChart, BarChart} from 'react-native-gifted-charts';
import HR from '../components/HR';
import {Buffer} from 'buffer';
import {NativeModules, NativeEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const BMSScreen = ({route, navigation}) => {
  const [failedState, setFailedState] = useState(false);
  const [requestInFlight, setRequestInFlight] = useState(false);
  const BMSStore = useBMSStore(state => state);
  const {deviceId} = route.params;
  const backgroundStyle = {
    backgroundColor: 'white',
  };

  const listenToCharacteristic = async () => {
    const serviceUUID = 'ff00';
    const characteristicUUID = 'ff01';

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
        props => {
          const {value, peripheral, characteristic, service} = props;
          console.log('Notification received from ' + characteristic);
          const receivedData = value
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
          BMSStore.getCellVoltages(receivedData);
          setRequestInFlight(false);
        },
      );
    } catch (error) {
      console.error('Notification error', error);
    }
  };

  const writeDataToDevice = async () => {
    const serviceUUID = 'ff00';
    const characteristicUUID = 'ff02';

    // Create a Buffer with the bytes
    const dataToSend = Buffer.from([0x24, 0x3a, 0x25]);

    try {
      await BleManager.retrieveServices(deviceId);
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
      navigation.navigate('BMSConnect');
    }
  };

  const getBLEData = async () => {
    console.log('get ble data called');
    if (!requestInFlight && !failedState) {
      setRequestInFlight(true);
      setTimeout(() => {
        console.log('set time out call');
        writeDataToDevice();
      }, 2000);
    }
  };

  useEffect(() => {
    setFailedState(false);
    listenToCharacteristic();
    const intervalId = setInterval(getBLEData, 2000); // Adjust interval as needed
    return () => clearInterval(intervalId); // Clear on cleanup
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
            left: 6,
          }}>
          <Text style={{right: 6, marginBottom: 6}}>SOC</Text>
          <PieChart
            radius={60}
            data={[
              {value: 70, color: 'green'},
              {value: 30, color: 'lightgray'},
            ]}
            donut
            innerRadius={50}
            centerLabelComponent={() => {
              return <Text style={{fontSize: 30}}>70%</Text>;
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BMSSettings');
            // getBLEData();
          }}
          activeOpacity={0.5}
          style={{
            alignSelf: 'center',
            borderWidth: 1,
            padding: 8,
            width: 120,
            alignItems: 'center',
          }}>
          <Text>Settings</Text>
        </TouchableOpacity>
        <HR />
        <View
          style={{
            marginTop: -15,
            paddingLeft: 10,
            paddingRight: 10,
            flex: 1,
            flexDirection: 'row',
          }}>
          <View>
            <Text style={{marginBottom: 8}}>
              Total Voltage: {BMSStore.totalVoltage}
            </Text>
            <Text style={{marginBottom: 8}}>
              Average Cell Voltage: {BMSStore.averageCellVoltage}
            </Text>
            <Text style={{marginBottom: 8}}>
              Cell Count: {BMSStore.cellCount}
            </Text>
            <Text>Voltage Diviation: {BMSStore.voltageDeviation}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{marginBottom: 8}}>
              Highest Cell: Cell {BMSStore.highestCellInPack.cell} @{' '}
              {BMSStore.highestCellInPack.voltage}
            </Text>
            <Text style={{marginBottom: 8}}>
              Lowest Cell: Cell {BMSStore.lowestCellInPack.cell} @{' '}
              {BMSStore.lowestCellInPack.voltage}
            </Text>
            <Text>Voltage Difference: {BMSStore.voltageDifference}</Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              marginLeft: 25,
              height: 1100,
              flex: 1,
              paddingLeft: 20,
            }}>
            <BarChart
              width={300}
              disableScroll
              hideYAxisText
              horizontal
              barWidth={23}
              data={BMSStore.barChartCellData}
              maxValue={4.25}
              mostNegativeValue={0}
              yAxisThickness={0}
              spacing={18}
              endSpacing={0}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BMSScreen;
