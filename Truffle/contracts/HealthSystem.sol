// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HealthSystem {
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

    struct Account {
        address metaMaskAccount;
        string role;
        bool isRegistered;
    }

    mapping(address => string) public metaMaskToEmail;
    mapping(address => Patient) public patients;
    mapping(address => Account) public accounts;

    event PatientExists(Patient patient);
    event PatientRegistered(address metaMaskAccount, string email);
    event AccountRegistered(address metaMaskAccount, string role);
    event AccountExists(address metaMaskAccount, string role);

    modifier onlyRegisteredPatient(address _metaMaskAccount) {
        require(accounts[_metaMaskAccount].isRegistered, "Account is not registered");
        _;
    }

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
        // Check if the MetaMask account is already registered as a patient
        if (bytes(metaMaskToEmail[_metaMaskAccount]).length != 0) {
            Patient memory existingPatient = patients[_metaMaskAccount];
            emit PatientExists(existingPatient);
            return;
        }

        // Store the patient details in the mapping
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

        // Map the MetaMask address to the email
        metaMaskToEmail[_metaMaskAccount] = _email;

        // Emit event for patient registration
        emit PatientRegistered(_metaMaskAccount, _email);
    }

    function registerAccount(address _metaMaskAccount, string memory _role) public {
        // Check if the account already has a role registered
        if (accounts[_metaMaskAccount].isRegistered) {
            revert("Account already has a role registered");
        }

        // Store the account details with role in the mapping
        accounts[_metaMaskAccount] = Account({
            metaMaskAccount: _metaMaskAccount,
            role: _role,
            isRegistered: true
        });

        // Emit event for account registration
        emit AccountRegistered(_metaMaskAccount, _role);
    }

    function getPatient(address _metaMaskAccount) public view returns (Patient memory) {
        return patients[_metaMaskAccount];
    }

    function getEmailByMetaMask(address _metaMaskAccount) public view returns (string memory) {
        return metaMaskToEmail[_metaMaskAccount];
    }

    function getAccount(address _metaMaskAccount) public view returns (Account memory) {
        return accounts[_metaMaskAccount];
    }

    function hasPersonalInfo(address _metaMaskAccount) public view returns (bool) {
        Patient memory patient = patients[_metaMaskAccount];
        if (bytes(patient.firstName).length > 0) {
            return true;
        }
        return false;
    }

    // Example of function that requires both registration and personal info
    function performAction(address _metaMaskAccount) public view onlyRegisteredPatient(_metaMaskAccount) {
        require(hasPersonalInfo(_metaMaskAccount), "Patient does not have personal info stored");
        // Perform action that requires both registration and personal info
    }
}
