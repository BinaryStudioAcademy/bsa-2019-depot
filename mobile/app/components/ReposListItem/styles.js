import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  container: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    padding: 5
  },
  dataDate: {
    color: colors.greyText,
    fontSize: 15,
    marginLeft: 10
  },
  descriptionText: {
    color: colors.greyText,
    fontSize: 12
  },
  descriptionView: {
    marginLeft: 26
  },
  starIcon: {
    height: 10,
    marginRight: 4,
    width: 10
  },
  starText: {
    color: colors.greyText,
    fontSize: 15,
    paddingLeft: 2
  },
  starsView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 26
  },
  titleIcon: {
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
    width: 20
  },
  titleText: {
    color: colors.blueLink,
    fontSize: 20
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
