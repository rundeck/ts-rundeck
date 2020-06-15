import * as fs from 'fs'

export const FS = {
    writeFile: fs.promises.writeFile,
    readFile: fs.promises.readFile
}