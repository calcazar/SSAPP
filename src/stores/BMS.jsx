import {create} from 'zustand';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

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
  cellCount: 0,
  cellVoltages: [],
  averageCellVoltage: 0,
  barChartCellData: [],
  highestCellInPack: {},
  lowestCellInPack: {},
  getCellVoltages: state => {
    const cellVoltages = [
      '4.25',
      '3.20',
      '3.18',
      '4.25',
      '3.14',
      '3.20',
      '3.18',
      '4.25',
      '3.14',
      '3.20',
      '3.18',
      '4.25',
      '3.14',
      '3.20',
      '3.18',
      '4.25',
      '3.14',
      '3.20',
      '3.18',
      '4.25',
    ];
    const cellVoltagesToFloat = cellVoltages.map(cell => parseFloat(cell));
    const cellCount = cellVoltages.length;
    const highestCell = cellVoltagesToFloat.findIndex(
      element => element === Math.max(...cellVoltagesToFloat),
    );
    const lowestCell = cellVoltagesToFloat.findIndex(
      element => element === Math.min(...cellVoltagesToFloat),
    );
    set({
      cellCount: parseFloat(cellCount),
      cellVoltages: cellVoltages,
      averageCellVoltage: (
        cellVoltagesToFloat.reduce((a, b) => a + b) / parseFloat(cellCount)
      ).toFixed(3),
      highestCellInPack: {
        cell: highestCell + 1,
        voltage: cellVoltagesToFloat[highestCell],
      },
      lowestCellInPack: {
        cell: lowestCell + 1,
        voltage: cellVoltagesToFloat[lowestCell],
      },
      barChartCellData: cellVoltagesToFloat.map((cell, index) => {
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
