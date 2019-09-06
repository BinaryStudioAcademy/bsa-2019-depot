import colors from '../../config/color.config';
import { StyleSheet } from 'react-native';

const width = '95%';
const bodyWidth = '94.1%';

export default StyleSheet.create({
  avatar: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    width: 40
  },
  comment: {
    marginTop: 20
  },
  commentAuthor: {
    fontWeight: 'bold'
  },
  commentBody: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    borderLeftColor: colors.greyBorder,
    borderLeftWidth: 1,
    borderRightColor: colors.greyBorder,
    borderRightWidth: 1,
    padding: 10,
    width: bodyWidth
  },
  commentBodyContainer: {
    marginLeft: 60
  },
  commentHeader: {
    alignItems: 'center',
    color: colors.greyText,
    flexDirection: 'row',
    height: 40,
    width: width
  },
  commentHeaderInfo: {
    alignItems: 'center',
    backgroundColor: '#f1f8ff',
    color: colors.greyText,
    flexDirection: 'row',
    flex: 1,
    height: 40,
    padding: 10,
    borderColor: colors.greyBorder,
    borderWidth: 1
  }
});
