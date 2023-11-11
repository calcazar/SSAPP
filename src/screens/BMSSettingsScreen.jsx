import {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  useColorScheme,
  Switch,
  View,
  Text,
  TextInput,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import useBMSStore from '../stores/BMS';
import HR from '../components/HR';

const BMSSettingsScreen = () => {
  const BMSStore = useBMSStore(state => state);

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  const chargeSettingsChangeToggle = () => {
    console.log(!BMSStore.BMSSettings.chargeOnly);
    BMSStore.updateBMSSettings({
      chargeOnly: !BMSStore.BMSSettings.chargeOnly,
    });
  };

  const socSettingsChangeToggle = () => {
    console.log(!BMSStore.BMSSettings.SOCLowestCellCalc);
    BMSStore.updateBMSSettings({
      SOCLowestCellCalc: !BMSStore.BMSSettings.SOCLowestCellCalc,
    });
  };

  console.log(BMSStore.BMSSettings.chargeOnly);
  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView style={{paddingTop: 30, height: '100%'}}>
        <View style={{alignItems: 'center', marginBottom: 14}}>
          <Text style={{fontWeight: '600'}}>BMS Bluetooth Broadcast</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: BMSStore.BMSSettings.chargeOnly ? 'black' : '#cdcdcd',
              alignSelf: 'center',
              marginRight: 10,
            }}>
            Always On
          </Text>
          <Switch
            onValueChange={chargeSettingsChangeToggle}
            value={!BMSStore.BMSSettings.chargeOnly}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: 10,
              color: !BMSStore.BMSSettings.chargeOnly ? 'black' : '#cdcdcd',
            }}>
            Charge Only
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 16,
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          <Text style={{fontSize: 13, color: '#5d5d5d', fontWeight: '600'}}>
            Controls boradcast mode for BMS. When set to Always on, Bluetooth
            will shut off when cell voltage is below 3v
          </Text>
        </View>
        <HR />
        <View style={{alignItems: 'center', marginBottom: 14}}>
          <Text style={{fontWeight: '600'}}>SOC Calculation Type</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: BMSStore.BMSSettings.SOCLowestCellCalc
                ? 'black'
                : '#cdcdcd',
              alignSelf: 'center',
              marginRight: 10,
            }}>
            Lowest Cell Voltage
          </Text>
          <Switch
            onValueChange={socSettingsChangeToggle}
            value={!BMSStore.BMSSettings.SOCLowestCellCalc}
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: 10,
              color: !BMSStore.BMSSettings.SOCLowestCellCalc
                ? 'black'
                : '#cdcdcd',
            }}>
            Average Cell Voltage
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 16,
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          <Text style={{fontSize: 13, color: '#5d5d5d', fontWeight: '600'}}>
            Controls SOC calculation type. Should SOC % be based on lowest cell
            value of average cell value of the pack
          </Text>
        </View>
        <HR />

        <View style={{alignItems: 'center', marginBottom: 14}}>
          <Text style={{fontWeight: '600'}}>SOC Curve Edit</Text>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text style={{width: 120, marginRight: 12, alignSelf: 'center'}}>
              Voltage at 100%:
            </Text>
            <TextInput
              value="4.25"
              style={{
                backgroundColor: 'white',
                padding: 8,
                width: 60,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{width: 120, marginRight: 12, alignSelf: 'center'}}>
              Voltage at 75%:
            </Text>
            <TextInput
              value="4.0"
              style={{
                backgroundColor: 'white',
                padding: 8,
                width: 60,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{width: 120, marginRight: 12, alignSelf: 'center'}}>
              Voltage at 50%:
            </Text>
            <TextInput
              value="3.6"
              style={{
                backgroundColor: 'white',
                padding: 8,
                width: 60,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{width: 120, marginRight: 12, alignSelf: 'center'}}>
              Voltage at 25%:
            </Text>
            <TextInput
              value="3.3"
              style={{
                backgroundColor: 'white',
                padding: 8,
                width: 60,
                borderRadius: 6,
              }}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{width: 120, marginRight: 12, alignSelf: 'center'}}>
              Voltage at 0%:
            </Text>
            <TextInput
              value="3.0"
              editable={false}
              selectTextOnFocus={false}
              style={{
                backgroundColor: '#efefef',
                color: '#777',
                padding: 8,
                width: 60,
                borderRadius: 6,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BMSSettingsScreen;
