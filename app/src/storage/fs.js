import RNFS from 'react-native-fs';

const root = RNFS.DocumentDirectoryPath

RNFS.mkdir(root + '/trainings')

export const filePutContents = (path, content) => RNFS.writeFile(root + path, content, 'utf8')

export const fileGetContents = (path) => RNFS.readFile(root + path, 'utf8')

export const rm = (path) => RNFS.unlink(root + path);
