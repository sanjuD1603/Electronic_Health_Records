// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Smart contract
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
        address patientAddress;
        address doctorAddress;
        uint256 meetingTime;
        string meetingDescription;
        bool isVerified;
    }

    Meeting[] public meetings;

    function createMeeting(
        address _patientAddress,
        address _doctorAddress,
        string memory _meetingDescription,
        uint256 _meetingTime,
        bool _isVerified
    ) public {
        meetings.push(
            Meeting({
                patientAddress: _patientAddress,
                doctorAddress: _doctorAddress,
                meetingTime: _meetingTime,
                meetingDescription: _meetingDescription,
                isVerified: _isVerified
            })
        );
    }

    function getPatientMeetings(
        address _patientAddress
    ) public view returns (Meeting[] memory) {
        Meeting[] memory patientMeetings = new Meeting[](meetings.length);
        uint256 count = 0;

        for (uint256 i = 0; i < meetings.length; i++) {
            if (meetings[i].patientAddress == _patientAddress) {
                patientMeetings[count] = meetings[i];
                count++;
            }
        }

        assembly {
            mstore(patientMeetings, count)
        }
        return patientMeetings;
    }

    function acceptMeeting(uint256 meetingIndex) public {
        require(meetingIndex < meetings.length, "Invalid meeting index");
        require(
            msg.sender == meetings[meetingIndex].doctorAddress,
            "Only the doctor can accept the meeting"
        );
        meetings[meetingIndex].isVerified = true;
    }

    function rejectMeeting(uint256 meetingIndex) public {
        require(meetingIndex < meetings.length, "Invalid meeting index");
        require(
            msg.sender == meetings[meetingIndex].doctorAddress,
            "Only the doctor can reject the meeting"
        );
        meetings[meetingIndex].isVerified = false;
    }

    function getMeeting(
        uint256 meetingIndex
    ) public view returns (address, address, uint256, string memory, bool) {
        require(meetingIndex < meetings.length, "Invalid meeting index");
        Meeting memory meeting = meetings[meetingIndex];
        return (
            meeting.patientAddress,
            meeting.doctorAddress,
            meeting.meetingTime,
            meeting.meetingDescription,
            meeting.isVerified
        );
    }

    function getDoctorMeetings(
        address _doctorAddress
    ) public view returns (Meeting[] memory) {
        Meeting[] memory doctorMeetings = new Meeting[](meetings.length);
        uint256 count = 0;

        for (uint256 i = 0; i < meetings.length; i++) {
            if (meetings[i].doctorAddress == _doctorAddress) {
                doctorMeetings[count] = meetings[i];
                count++;
            }
        }

        assembly {
            mstore(doctorMeetings, count)
        }
        return doctorMeetings;
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
        require(
            accounts[_metaMaskAccount].isRegistered,
            "Account is not registered"
        );
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

    function registerAccount(
        address _metaMaskAccount,
        string memory _role
    ) public {
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

    function getPatient(
        address _metaMaskAccount
    ) public view returns (Patient memory) {
        return patients[_metaMaskAccount];
    }

    function getDoctor(
        address _metaMaskAccount
    ) public view returns (Doctor memory) {
        return doctors[_metaMaskAccount];
    }

    function getEmailByMetaMask(
        address _metaMaskAccount
    ) public view returns (string memory) {
        return metaMaskToEmail[_metaMaskAccount];
    }

    function getAccount(
        address _metaMaskAccount
    ) public view returns (Account memory) {
        return accounts[_metaMaskAccount];
    }

    function hasPersonalInfo(
        address _metaMaskAccount
    ) public view returns (bool) {
        Patient memory patient = patients[_metaMaskAccount];
        Doctor memory doctor = doctors[_metaMaskAccount];
        if (
            bytes(patient.firstName).length > 0 ||
            bytes(doctor.firstName).length > 0
        ) {
            return true;
        }
        return false;
    }

    function performAction(
        address _metaMaskAccount
    ) public view onlyRegisteredAccount(_metaMaskAccount) {
        require(
            hasPersonalInfo(_metaMaskAccount),
            "Account does not have personal info stored"
        );
    }
}
