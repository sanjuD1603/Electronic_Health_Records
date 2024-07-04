var patients = artifacts.require("./HealthSystem.sol");

module.exports = function (deployer) {
    deployer.deploy(patients);
}