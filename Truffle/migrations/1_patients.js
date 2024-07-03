var patients = artifacts.require("./patientInfo.sol");

module.exports = function (deployer) {
    deployer.deploy(patients);
}