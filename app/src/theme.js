import {Typography, Colors} from 'react-native-ui-lib'

const colorsPalette = {
    dark10: '#20303C',
    dark20: '#43515C',
    dark30: '#66737C',
    dark40: '#858F96',
    dark50: '#A3ABB0',
    dark60: '#C2C7CB',
    dark70: '#E0E3E5',
    dark80: '#F2F4F5',
    // BLUE,
    blue10: '#3182C8',
    blue20: '#4196E0',
    blue30: '#459FED',
    blue40: '#57a8ef',
    blue50: '#8fc5f4',
    blue60: '#b5d9f8',
    blue70: '#daecfb',
    blue80: '#ecf5fd',

    // CYAN,
    cyan10: '#00AAAF',
    cyan20: '#32BABC',
    cyan30: '#3CC7C5',
    cyan40: '#64D4D2',
    cyan50: '#8BDFDD',
    cyan60: '#B1E9E9',
    cyan70: '#D8F4F4',
    cyan80: '#EBF9F9',
    // GREEN,
    green10: '#00A65F',
    green20: '#32B76C',
    green30: '#65C888',
    green40: '#84D3A0',
    green50: '#A3DEB8',
    green60: '#C1E9CF',
    green70: '#E8F7EF',
    green80: '#F3FBF7',
    // YELLOW,
    yellow10: '#E2902B',
    yellow20: '#FAA030',
    yellow30: '#FAAD4D',
    yellow40: '#FBBD71',
    yellow50: '#FCCE94',
    yellow60: '#FDDEB8',
    yellow70: '#FEEFDB',
    yellow80: '#FEF7ED',
    // ORANGE,
    orange10: '#D9644A',
    orange20: '#E66A4E',
    orange30: '#F27052',
    orange40: '#F37E63',
    orange50: '#F7A997',
    orange60: '#FAC6BA',
    orange70: '#FCE2DC',
    orange80: '#FEF0ED',
    // RED,
    red10: '#CF262F',
    red20: '#EE2C38',
    red30: '#F2564D',
    red40: '#F57871',
    red50: '#F79A94',
    red60: '#FABBB8',
    red70: '#FCDDDB',
    red80: '#FEEEED',
    // PURPLE,
    purple10: '#8B1079',
    purple20: '#A0138E',
    purple30: '#B13DAC',
    purple40: '#C164BD',
    purple50: '#D08BCD',
    purple60: '#E0B1DE',
    purple70: '#EFD8EE',
    purple80: '#F7EBF7',
    // VIOLET,
    violet10: '#48217B',
    violet20: '#542790',
    violet30: '#733CA6',
    violet40: '#8F63B8',
    violet50: '#AB8ACA',
    violet60: '#C7B1DB',
    violet70: '#E3D8ED',
    violet80: '#F1EBF6',
    // WHITE,
    white: '#ffffff',
    black: '#000000',
};

Colors.loadColors({
    themebackground: '#242424',
    themeheader: '#3e3e3e',
    cdark: Colors.dark10,
    clight: Colors.dark70,
    cmuted: Colors.dark50,
    cprimary: Colors.blue10,
    cdanger: Colors.red10,
    csuccess: Colors.green10,
    cwarning: Colors.yellow10,
})

Typography.loadTypographies({
    header1: {
        ...Typography.text20,
        fontWeight: '300',
        color: Colors.clight
    },
    header2: {
        ...Typography.text30,
        color: Colors.clight
    },
    header3: {
        ...Typography.text40,
        color: Colors.clight
    },
    header3Success: {
        ...Typography.text40,
        color: Colors.csuccess
    },
    header3Warning: {
        ...Typography.text40,
        color: Colors.cwarning
    },
    header3Danger: {
        ...Typography.text40,
        color: Colors.cdanger
    },
    header3Primary: {
        ...Typography.text40,
        color: Colors.cprimary
    },
    header4: {
        ...Typography.text50,
        color: Colors.clight
    },
    header4Success: {
        ...Typography.text50,
        color: Colors.csuccess
    },
    header4Warning: {
        ...Typography.text50,
        color: Colors.cwarning
    },
    header4Danger: {
        ...Typography.text50,
        color: Colors.cdanger
    },
    header4Primary: {
        ...Typography.text50,
        color: Colors.cprimary
    },
    header5: {
        ...Typography.text60,
        color: Colors.clight
    },
    paragraph: {
        ...Typography.text70,
        color: Colors.clight
    },
    paragraphDark: {
        ...Typography.text70,
        color: Colors.cdark
    },
    helpText: {
        ...Typography.text80,
        color: Colors.cmuted
    },
    textDanger: {
        ...Typography.text70,
        color: Colors.cdanger
    },
    textWarning: {
        ...Typography.text70,
        color: Colors.cwarning
    },
    textSuccess: {
        ...Typography.text70,
        color: Colors.csuccess
    },
    textPrimary: {
        ...Typography.text70,
        color: Colors.cprimary
    },
    textSecondary: {
        ...Typography.text70,
        color: Colors.cmuted
    },
    textSmallSecondary: {
        ...Typography.text90,
        color: Colors.cmuted
    },
    textSmallPrimary: {
        ...Typography.text90,
        color: Colors.cprimary
    },
});