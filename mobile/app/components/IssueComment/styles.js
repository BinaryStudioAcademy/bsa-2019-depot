import colors from '../../config/color.config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  avatar: {
    height: 15,
    marginRight: 10,
    width: 15
  },
  comment: {
    marginTop: 20
  },
  commentAuthor: {
    fontWeight: 'bold'
  },
  commentBody: {
    alignSelf: 'center',
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    borderLeftColor: colors.greyBorder,
    borderLeftWidth: 1,
    borderRightColor: colors.greyBorder,
    borderRightWidth: 1,
    padding: 10,
    width: '95%'
  },
  commentBodyContainer: {
    marginLeft: 60
  },
  commentHeader: {
    alignItems: 'center',
    alignSelf: 'center',
    color: colors.greyText,
    flexDirection: 'row',
    height: 40,
    width: '95%'
  },
  commentHeaderInfo: {
    alignItems: 'center',
    backgroundColor: colors.white,
    color: colors.greyText,
    flexDirection: 'row',
    flex: 1,
    height: 40,
    padding: 10,
    borderColor: colors.greyBorder,
    borderWidth: 1
  }
});
