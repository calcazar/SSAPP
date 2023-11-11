import {useEffect} from 'react';
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

const BMSScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const BMSStore = useBMSStore(state => state);

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  useEffect(() => {
    BMSStore.getCellVoltages();
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
              Average Cell Voltage: {BMSStore.averageCellVoltage}
            </Text>
            <Text>Cell Count: {BMSStore.cellCount}</Text>
          </View>
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{marginBottom: 8}}>
              Highest Cell: Cell {BMSStore.highestCellInPack.cell} @{' '}
              {BMSStore.highestCellInPack.voltage}
            </Text>
            <Text>
              Lowest Cell: Cell {BMSStore.lowestCellInPack.cell} @{' '}
              {BMSStore.lowestCellInPack.voltage}
            </Text>
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
              isAnimated
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

          {/* {BMSStore.cellVoltages.map((cellVoltage, index) => {
            return (
              <Text key={`cell-${index}`}>
                Cell {index + 1}: {cellVoltage}
              </Text>
            );
          })} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BMSScreen;
