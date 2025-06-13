// Sample residents data
const sampleResidents = [
    {
        id: "RES-001",
        firstName: "Juan",
        lastName: "Dela Cruz",
        middleName: "Santos",
        age: 34,
        gender: "Male",
        birthDate: "1990-03-15",
        civilStatus: "Married",
        address: "123 Maharlika St, Purok 1",
        phone: "09123456789",
        email: "juan.delacruz@email.com",
        occupation: "Teacher",
        status: "Active" as const,
        dateRegistered: "2023-01-15",
        emergencyContact: "Maria Dela Cruz",
        emergencyPhone: "09187654321",
        avatar: "JD"
    },
    {
        id: "RES-002",
        firstName: "Maria",
        lastName: "Santos",
        middleName: "Garcia",
        age: 28,
        gender: "Female",
        birthDate: "1995-07-22",
        civilStatus: "Single",
        address: "456 Rizal Ave, Purok 2",
        phone: "09234567890",
        email: "maria.santos@email.com",
        occupation: "Nurse",
        status: "Active" as const,
        dateRegistered: "2023-02-20",
        emergencyContact: "Ana Santos",
        emergencyPhone: "09298765432",
        avatar: "MS"
    },
    {
        id: "RES-003",
        firstName: "Pedro",
        lastName: "Reyes",
        middleName: "Lopez",
        age: 45,
        gender: "Male",
        birthDate: "1979-11-08",
        civilStatus: "Married",
        address: "789 Bonifacio St, Purok 3",
        phone: "09345678901",
        email: "pedro.reyes@email.com",
        occupation: "Mechanic",
        status: "Inactive" as const,
        dateRegistered: "2022-12-10",
        emergencyContact: "Rosa Reyes",
        emergencyPhone: "09309876543",
        avatar: "PR"
    },
    {
        id: "RES-004",
        firstName: "Ana",
        lastName: "Garcia",
        middleName: "Cruz",
        age: 31,
        gender: "Female",
        birthDate: "1992-05-14",
        civilStatus: "Widowed",
        address: "321 Luna St, Purok 1",
        phone: "09456789012",
        email: "ana.garcia@email.com",
        occupation: "Shopkeeper",
        status: "Active" as const,
        dateRegistered: "2023-03-12",
        emergencyContact: "Luis Garcia",
        emergencyPhone: "09401234567",
        avatar: "AG"
    },
    {
        id: "RES-005",
        firstName: "Carlos",
        lastName: "Martinez",
        middleName: "Fernandez",
        age: 52,
        gender: "Male",
        birthDate: "1971-09-03",
        civilStatus: "Married",
        address: "654 Del Pilar St, Purok 2",
        phone: "09567890123",
        email: "carlos.martinez@email.com",
        occupation: "Farmer",
        status: "Active" as const,
        dateRegistered: "2022-11-25",
        emergencyContact: "Elena Martinez",
        emergencyPhone: "09512345678",
        avatar: "CM"
    },
]

// Sample pending registrations data
const samplePendingRegistrations = [
    {
        id: "REG-001",
        firstName: "Elena",
        lastName: "Rivera",
        middleName: "Santos",
        age: 29,
        gender: "Female",
        birthDate: "1995-08-20",
        civilStatus: "Single",
        address: "789 Mabini St, Purok 4",
        phone: "09567890123",
        email: "elena.rivera@email.com",
        occupation: "Software Engineer",
        dateSubmitted: "2024-03-15",
        emergencyContact: "Manuel Rivera",
        emergencyPhone: "09567890124",
        avatar: "ER",
        documents: [
            {
                type: "Valid ID Photo",
                status: "submitted",
                url: "https://picsum.photos/800/600?random=1",
                name: "national-id.jpg"
            },
            {
                type: "Profile Picture",
                status: "submitted",
                url: "https://picsum.photos/800/600?random=2",
                name: "profile-photo.jpg"
            },
            {
                type: "Proof of Residence",
                status: "pending",
                url: "",
                name: ""
            }
        ]
    },
    {
        id: "REG-002",
        firstName: "Marco",
        lastName: "Tan",
        middleName: "Lee",
        age: 35,
        gender: "Male",
        birthDate: "1989-04-12",
        civilStatus: "Married",
        address: "456 Rizal Ave, Purok 2",
        phone: "09234567891",
        email: "marco.tan@email.com",
        occupation: "Business Owner",
        dateSubmitted: "2024-03-14",
        emergencyContact: "Lisa Tan",
        emergencyPhone: "09234567892",
        avatar: "MT",
        documents: [
            {
                type: "Valid ID Photo",
                status: "submitted",
                url: "https://picsum.photos/800/600?random=3",
                name: "drivers-license.jpg"
            },
            {
                type: "Profile Picture",
                status: "pending",
                url: "",
                name: ""
            },
            {
                type: "Proof of Residence",
                status: "submitted",
                url: "https://picsum.photos/800/600?random=4",
                name: "utility-bill.jpg"
            }
        ]
    }
];