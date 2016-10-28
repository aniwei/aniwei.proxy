import space from '../space'
import {
  cyan500,
  cyan700,
  grey400,
  pinkA200,
  grey100,
  grey500,
  darkBlack,
  white,
  grey300,
  fullBlack
} from '../colors'

import { fade } from '../util/colormanipulator'

const colors = {
  primary: '#2dbe60',
  secondary: '#2dbe60',
  background: 'background: linear-gradient(37deg, #20a6a5 0, #5bc583 100%)'
};

export default {
  spacing: space,
  fontFamily: 'Roboto, sans-serif',
  appBar: {
    background: colors.backgroundColor,
    fontSize: 18
  },
  palette: {
    primary1Color: colors.primary,
    primary2Color: colors.primary,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: fade(darkBlack, 0.54),
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack
  }
};
