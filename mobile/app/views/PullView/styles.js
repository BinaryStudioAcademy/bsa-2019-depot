import colors from '../../config/color.config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
    borderColor: colors.blueButton,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 8,
    width: '30%'
  },
  closeIcon: {
    marginRight: 5
  },
  closeText: {
    color: colors.blueButton
  },
  commentButton: {
    backgroundColor: colors.blueButton
  },
  commentButtonContainer: {
    marginRight: 10
  },
  commentInput: {
    alignSelf: 'center',
    borderColor: colors.greyBorder,
    borderWidth: 1,
    marginTop: 20,
    width: '95%'
  },
  commentText: {
    color: colors.white
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
  issueButtons: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 11,
    marginTop: 10,
    width: '100%'
  },
  mergeButton: {
    marginRight: 10
  },
  pullButton: {
    borderColor: colors.blueLink,
    borderWidth: 0.6
  },
  pullButtons: {
    flexDirection: 'row'
  },
  pullButtonsTitle: {
    color: colors.blueLink
  }
});
