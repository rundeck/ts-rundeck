function notImpl() {
   throw new Error('Not implemented')
}

async function readFile(file: string) {
    const resp = await fetch(file)
    return await resp.text()
}

export const FS = {
    writeFile: notImpl,
    readFile: readFile
}