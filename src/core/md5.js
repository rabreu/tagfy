const md5File = require('md5-file')

const md5 = (files) => {
    md5Files = []
    files.forEach(file => {
        md5Files.push(md5File(file))
    });
    return md5Files
}