import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  data: {
    flexDirection: 'row'
  },
  dataCircle: {
    backgroundColor: colors.yellow,
    borderRadius: 50,
    height: 12,
    marginRight: 5,
    width: 12
  },
  dataDate: {
    color: colors.greyText,
    fontSize: 15
  },
  dataLanguage: {
    color: colors.greyText,
    fontSize: 15
  },
  dataLanguageInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10
  },
  dataStars: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10
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
    fontSize: 15
  }
});
