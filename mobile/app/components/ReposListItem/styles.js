import { StyleSheet } from 'react-native';
import colors from '../../config/color.config';

export default StyleSheet.create({
  container: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 2,
    padding: 6
  },
  descriptionText: {
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
  starsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    fontSize: 16
  },
  titleView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
