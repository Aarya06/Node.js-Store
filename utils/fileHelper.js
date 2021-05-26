const fs = require('fs')

const deleteFile = (path) => {
    fs.unlink(path.slice(1), (err) => {
        if (err) {
            throw err
        }
    })
}

exports.deleteFile = deleteFile;