function checkIfDuplicatesExist(arr) {
    return new Set(arr).size !== arr.length
}

module.exports = checkIfDuplicatesExist