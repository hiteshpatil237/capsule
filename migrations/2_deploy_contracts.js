const DrugPackage = artifacts.require("DrugPackage");

module.exports = function(deployer) {
  deployer.deploy(DrugPackage);
};
