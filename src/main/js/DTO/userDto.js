class userDto {

    setName(name) {
        this.name = name;
    }
    setForceNumber(forceNumber) {
        this.forceNumber = forceNumber;
    }
    setUnit(unit) {
        this.unit = unit;
    }
    setQuarterType(quarterType) {
        this.quarterType = quarterType;
    }
    setQuarterNumber(quarterNumber) {
        this.quarterNumber = quarterNumber;
    }
    setPassword(password) {
        this.password = password;
    }
    getName() {
        return this.name;
    }
    getForceNumber() {
        return this.forceNumber;
    }
    getUnit() {
        return this.unit;
    }
    getQuarterType() {
        return this.quarterType;
    }
    getQuarterNumber() {
        return this.quarterNumber;
    }
    getPassword() {
        return this.password;
    }

}

module.exports = userDto;