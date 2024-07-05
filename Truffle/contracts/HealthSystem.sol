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

    struct Doctor {
        string firstName;
        string lastName;
        string dateOfBirth;
        string email;
        string doctorAddress;
        string phoneNumber;
        address metaMaskAccount;
        string specialization;
        string medicalLicenseNumber;
        string yearsOfExperience;
    }

    struct Account {
        address metaMaskAccount;
        string role;
        bool isRegistered;
    }

    struct Meeting {
        //which doc??
        address patient;
        address doctor;
        string meetingTime;
        string meetingLink;
    }

    
    mapping(address => string) public metaMaskToEmail;
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Account) public accounts;

    event PatientExists(address indexed metaMaskAccount, Patient patient);
    event PatientRegistered(address indexed metaMaskAccount, string email);
    event DoctorExists(address indexed metaMaskAccount, Doctor doctor);
    event DoctorRegistered(address indexed metaMaskAccount, string email);
    event AccountRegistered(address indexed metaMaskAccount, string role);
    event AccountExists(address indexed metaMaskAccount, Account account);

    modifier onlyRegisteredAccount(address _metaMaskAccount) {
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

        // Emit events for patient registration and existence
        emit PatientRegistered(_metaMaskAccount, _email);
        emit PatientExists(_metaMaskAccount, patients[_metaMaskAccount]);
    }

    function registerDoctor(
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _email,
        string memory _doctorAddress,
        string memory _phoneNumber,
        address _metaMaskAccount,
        string memory _specialization,
        string memory _medicalLicenseNumber,
        string memory _yearsOfExperience
    ) public {
        // Store the doctor details in the mapping
        doctors[_metaMaskAccount] = Doctor(
            _firstName,
            _lastName,
            _dateOfBirth,
            _email,
            _doctorAddress,
            _phoneNumber,
            _metaMaskAccount,
            _specialization,
            _medicalLicenseNumber,
            _yearsOfExperience
        );

        // Map the MetaMask address to the email
        metaMaskToEmail[_metaMaskAccount] = _email;

        // Emit events for doctor registration and existence
        emit DoctorRegistered(_metaMaskAccount, _email);
        emit DoctorExists(_metaMaskAccount, doctors[_metaMaskAccount]);
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
        emit AccountExists(_metaMaskAccount, accounts[_metaMaskAccount]);
    }

    function getPatient(address _metaMaskAccount) public view returns (Patient memory) {
        return patients[_metaMaskAccount];
    }

    function getDoctor(address _metaMaskAccount) public view returns (Doctor memory) {
        return doctors[_metaMaskAccount];
    }

    function getEmailByMetaMask(address _metaMaskAccount) public view returns (string memory) {
        return metaMaskToEmail[_metaMaskAccount];
    }

    function getAccount(address _metaMaskAccount) public view returns (Account memory) {
        return accounts[_metaMaskAccount];
    }

    function hasPersonalInfo(address _metaMaskAccount) public view returns (bool) {
        Patient memory patient = patients[_metaMaskAccount];
        Doctor memory doctor = doctors[_metaMaskAccount];
        if (bytes(patient.firstName).length > 0 || bytes(doctor.firstName).length > 0) {
            return true;
        }
        return false;
    }

    function performAction(address _metaMaskAccount) public view onlyRegisteredAccount(_metaMaskAccount) {
        require(hasPersonalInfo(_metaMaskAccount), "Account does not have personal info stored");
    }

    function setMeeting(address _doctor, address _patient, string memory _meetingTime, string memory _meetingLink) public view {
        Meeting memory newMeeting = Meeting({
        patient : _patient,
        doctor : _doctor,
        meetingTime :_meetingTime,
        meetingLink : _meetingLink
        });
    }

}
