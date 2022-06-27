module.exports = {
    components: {
      schemas: {
        User: {
            type: "object",
            description: "Schema for User",
            properties: {
                name: {
                    type: "string",
                    description: "Name of the user",
                    example: "Ramesh Kumar"
                },
                forceNumber: {
                    type: "string",
                    description: "Force Number of the user",
                    example: "00UA1111"
                },
                password: {
                    type: "string",
                    description: "Password of the user",
                    example: "abc123"
                },
                unit: {
                    type: "string",
                    description: "Unit of the user",
                    example: "suitable unit"
                },
                designation: {
                    type: "string",
                    description: "Designation of the user",
                    example: "suitable designation"
                },
                quarterType: {
                    type: "int",
                    description: "Quarter Type of the user",
                    example: "2"
                },
                quarterNumber: {
                    type: "int",
                    description: "Quarter Number of the user",
                    example: "18"
                }
            }
        },
        Complaint: {
            type: "object",
            description: "Schema for complaint",
            properties: {
                complaintNumber: {
                    type: "string",
                    description: "Complaint Number",
                    example: "valid complaint number"
                },
                forceNumber: {
                    type: "string",
                    description: "Force Number of the user who registered the complaint",
                    example: "00UA1111"
                },
                quarterNumber: {
                    type: "int",
                    description: "Quarter Number where complaint needs to be processed",
                    example: "18"
                },
                category: {
                    type: "string",
                    description: "Category of the complaint",
                    example: "CARPENTERY"
                },
                registrationDate: {
                    type: "Date",
                    description: "Date of registration",
                    example: "2022-06-10"
                },
                status: {
                    type: "int",
                    description: "Status of the complaint",
                    example: "1"
                },
                resolutionDate: {
                    type: "Date",
                    description: "Date of resolution of the complaint (if resolved)",
                    example: "2022-06-20"
                },
                reasonOfCancellation: {
                    type: "string",
                    description: "Reason of cancellation of complaint (if cancelled)",
                    example: "Fixed it myself",
                },
                feedbackRating: {
                    type: "int",
                    description: "Feedback of user towards resolution provided (after resolving the complaint)",
                    example: "10"
                }
            }
        }
      }
    }
  };