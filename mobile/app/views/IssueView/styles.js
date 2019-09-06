import colors from '../../config/color.config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.blueButton,
    borderColor: colors.white,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.white,
    justifyContent: 'center',
    margin: 10,
    marginRight: 20,
    paddingVertical: 8,
    width: '20%'
  },
  commentInput: {
    alignSelf: 'flex-end',
    borderColor: colors.greyBorder,
    borderWidth: 1,
    marginRight: 20,
    marginTop: 20,
    width: '80.5%'
  },
  data: {
    flexDirection: 'row',
    paddingLeft: 25
  },
  dataDate: {
    color: colors.greyText,
    fontSize: 15,
    paddingLeft: 7
  },
  dataNumber: {
    color: colors.greyText,
    fontSize: 15
  },
  dataUsername: {
    color: colors.greyText,
    fontSize: 15,
    paddingLeft: 7
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 10
  },
  headerText: {
    color: colors.blueLink,
    fontSize: 20,
    paddingLeft: 10
  },
  issue: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    padding: 5
  },
  issueBody: {
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
    color: colors.greyText,
    fontSize: 20,
    paddingLeft: 30,
    padding: 10
  },
  text: {
    color: colors.white
  }
});
