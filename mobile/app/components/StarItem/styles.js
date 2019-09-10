import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  data: {
    flexDirection: 'row',
    marginLeft: 26
  },
  dataDate: {
    color: colors.greyText,
    fontSize: 15
  },
  dataStars: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerText: {
    color: colors.blueLink,
    fontSize: 20
  },
  starItem: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    paddingLeft: 10,
    padding: 5
  },
  starsCounter: {
    color: colors.greyText,
    fontSize: 15,
    marginLeft: 2
  },
  titleIcon: {
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
    width: 20
  }
});
