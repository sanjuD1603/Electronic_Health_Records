// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract patientInfo {
    struct Patient {
        string firstName;
        string lastName;
        string dateOfBirth;
        string email;
        string gender;
        string patientAddress;
        string phoneNumber;
        string bloodgroup;
        address metaMaskAccount;
        string insuranceProvider;
        string policyNumber;
    }

    mapping(address => string) public metaMaskToEmail;
    mapping(address => Patient) public patients;

    function registerPatient(
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _email,
        string memory _gender,
        string memory _patientAddress,
        string memory _phoneNumber,
        string memory _bloodgroup,
        address _metaMaskAccount,
        string memory _insuranceProvider,
        string memory _policyNumber
    ) public {
        patients[_metaMaskAccount] = Patient(
            _firstName,
            _lastName,
            _dateOfBirth,
            _email,
            _gender,
            _patientAddress,
            _phoneNumber,
            _bloodgroup,
            _metaMaskAccount,
            _insuranceProvider,
            _policyNumber
        );

        metaMaskToEmail[_metaMaskAccount] = _email;
    }

    function getPatient(address _metaMaskAccount) public view returns (Patient memory) {
        return patients[_metaMaskAccount];
    }

    function getEmailByMetaMask(address _metaMaskAccount) public view returns (string memory) {
        return metaMaskToEmail[_metaMaskAccount];
    }
}
