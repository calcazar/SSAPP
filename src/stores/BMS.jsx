import {create} from 'zustand';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const BMSDataParser = dataString => {
  // var currentTime = new Date();
  // var seconds = currentTime.getSeconds();
  const cellData = {
    totalVoltage: 0,
    highestCell: 0,
    highestVoltage: 0,
    lowestCell: 0,
    lowestVoltage: Infinity,
    cellVoltages: [],
    voltageDifference: 0,
    averageVoltage: 0,
    voltageDeviation: 0,
    batteryQuantity: 0,
  };
  if (!dataString) {
    return cellData;
  }
  // Remove spaces from the input string
  const cleanDataString = dataString.replace(/ /g, '');

  // Ensure the input is a string
  if (typeof cleanDataString !== 'string') {
    console.error('Input must be a string');
    return;
  }

  // Extract and log the header information
  const head = cleanDataString.slice(0, 2);
  // console.log(`Head: ${head}`);

  // Extract and log the function code
  const functionCode = cleanDataString.slice(2, 4);
  // console.log(`Function Code: ${functionCode}`);

  cellData.batteryQuantity = parseInt(cleanDataString.slice(4, 6), 16);

  // Parse and log each cell voltage
  for (let i = 0; i < cellData.batteryQuantity; i++) {
    const totalCellData = cleanDataString.slice(6 + i * 4, 10 + i * 4);
    const cellVoltage = parseInt(totalCellData, 16) * 0.001; // Convert to volts

    // Skip cells with NaN values
    if (!isNaN(cellVoltage)) {
      cellData.cellVoltages.push(cellVoltage);
      cellData.totalVoltage += cellVoltage;
      // console.log('voltage', cellData.totalVoltage);
      // console.log(`Cell ${i + 1}: ${cellVoltage.toFixed(3)} V`);

      if (cellVoltage > cellData.highestVoltage) {
        cellData.highestVoltage = cellVoltage;
        cellData.highestCell = i + 1;
      }

      if (cellVoltage < cellData.lowestVoltage) {
        cellData.lowestVoltage = cellVoltage;
        cellData.lowestCell = i + 1;
      }
    }
  }

  cellData.voltageDifference = cellData.highestVoltage - cellData.lowestVoltage;

  const validCellCount = cellData.cellVoltages.length;

  const averageVoltage = cellData.totalVoltage / validCellCount;
  cellData.averageVoltage = averageVoltage.toFixed(3);

  cellData.cellVoltages.forEach((voltage, index) => {
    const deviation = voltage - averageVoltage;
    cellData.voltageDeviation = deviation.toFixed(3);
  });

  const checksum = cleanDataString.slice(-2);
  console.log(`Checksum: ${checksum}`);

  return cellData;
};

const getCellColor = (index, high, low) => {
  switch (index) {
    case high:
      return {barColor: 'red', textColor: 'white'};
    case low:
      return {barColor: 'blue', textColor: 'white'};
    default:
      return {barColor: 'gray', textColor: 'white'};
  }
};

const useBMSStore = create(set => ({
  totalVoltage: 0,
  cellCount: 0,
  cellVoltages: [],
  averageCellVoltage: 0,
  barChartCellData: [],
  highestCellInPack: {},
  lowestCellInPack: {},
  voltageDeviation: 0,
  voltageDifference: 0,
  getCellVoltages: dataString => {
    const {
      totalVoltage,
      cellVoltages,
      batteryQuantity: cellCount,
      highestCell,
      lowestVoltage,
      highestVoltage,
      lowestCell,
      averageVoltage,
      voltageDifference,
      voltageDeviation,
    } = BMSDataParser(dataString);

    // const cellVoltagesToFloat = cellVoltages.map(cell => parseFloat(cell));

    set({
      voltageDeviation,
      voltageDifference: voltageDifference.toFixed(2),
      totalVoltage: totalVoltage.toFixed(3),
      cellCount: parseFloat(cellCount),
      cellVoltages: cellVoltages,
      averageCellVoltage: averageVoltage,
      highestCellInPack: {
        cell: highestCell + 1,
        voltage: highestVoltage.toFixed(3),
      },
      lowestCellInPack: {
        cell: lowestCell + 1,
        voltage: lowestVoltage.toFixed(3),
      },
      barChartCellData: cellVoltages.map((cell, index) => {
        return {
          value: cell,
          label: index + 1,
          frontColor: getCellColor(index, highestCell, lowestCell).barColor,
          labelComponent: () => (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  right: 17,
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    width: 50,
                    fontSize: 12,
                  }}>
                  Cell {index + 1}: {'  '}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: getCellColor(index, highestCell, lowestCell)
                      .textColor,
                  }}>
                  {cell.toFixed(3)}
                </Text>
              </View>
            </View>
          ),
        };
      }),
    });
  },
  BMSSettings: {
    chargeOnly: false,
    SOCLowestCellCalc: false,
  },
  updateBMSSettings: settingsOptions => {
    console.log(settingsOptions);
    set(state => {
      console.log({BMSSettings: {...state.BMSSettings, ...settingsOptions}});
      return {BMSSettings: {...state.BMSSettings, ...settingsOptions}};
    });
  },
}));

export default useBMSStore;
