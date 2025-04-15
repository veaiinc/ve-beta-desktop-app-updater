import axios from 'axios';

export async function sendContactFormData(formData) {
	const {
		email,
		firstName,
		lastName,
		companyName,
		jobTitle,
		platformUsers,
		headquarters,
		message,
		marketingConsent,
		type,
	} = formData;

	const formInput = `
    {
        "responseInput": {
          "response": [
            {
              "_id": "67fcfbbcbfcf70d43e4f3585",
              "type": "email",
              "question": "Work Email",
              "required": true,
              "order": 1,
              "isEditing": false,
              "placeholder": "Work Email",
              "answer": "${email}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f3586",
              "type": "shortanswer",
              "question": "First Name",
              "required": true,
              "order": 2,
              "isEditing": false,
              "placeholder": "First Name",
              "answer": "${firstName}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f3587",
              "type": "shortanswer",
              "question": "Last Name",
              "required": true,
              "order": 3,
              "isEditing": false,
              "placeholder": "Last Name",
              "answer": "${lastName}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f3588",
              "type": "shortanswer",
              "question": "Company Name",
              "required": true,
              "order": 4,
              "isEditing": false,
              "placeholder": "Company Name",
              "answer": "${companyName}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f3589",
              "type": "shortanswer",
              "question": "Job Title",
              "required": true,
              "order": 5,
              "isEditing": false,
              "placeholder": "Job Title",
              "answer": "${jobTitle}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f358a",
              "type": "shortanswer",
              "question": "Platform Users",
              "required": false,
              "order": 6,
              "isEditing": false,
              "placeholder": "Platform Users",
              "answer": "${platformUsers}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f358b",
              "type": "shortanswer",
              "question": "Company Headquarters",
              "required": false,
              "order": 7,
              "isEditing": false,
              "placeholder": "Company Headquarters",
              "answer": "${headquarters}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbbcbfcf70d43e4f358c",
              "type": "longanswer",
              "question": "Tell us more about how you want to use VE.AI",
              "required": false,
              "order": 8,
              "isEditing": false,
              "placeholder": "Tell us more about how you want to use VE.AI",
              "answer": "${message}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            },
            {
              "_id": "67fcfbe9bfcf70d43e4f3592",
              "type": "dropdown",
              "question": "Type",
              "required": true,
              "order": 1,
              "isEditing": false,
              "placeholder": "Type",
              "answer": "${type}",
              "validation": {
                "pattern": {},
                "operators": []
              },
              "conditions": [],
              "actions": []
            }
          ]
        }
      }
    `;

	try {
		const response = await axios.post(
			'https://ap.api.ve.ai/workflows/1.0/veai/67fcfbbcbfcf70d43e4f358d/67fcfbbcbfcf70d43e4f358e/67fcfbbcbfcf70d43e4f3584',
			formInput,
			{
				headers: {
					Authorization:
						'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdlYjk4NWFhNjZjNWZiZjkwYzVkOTBiIiwidXNlclR5cGUiOiJ0ZW5hbnRVc2VyIiwidXNlck5hbWUiOiJLYXBpbCIsImlhdCI6MTc0NDYzNTA1NywiZXhwIjoxNzQ3MjI3MDU3LCJpc3MiOiJ2ZWFpLWp3dC1pc3N1ZXIifQ.sL1dB4hp6O_LQMJdvU51aI6B6AOENaTb1R_BNC7iagbnT0RL8SSenex1HuP3PJ_pq9JBbuuGAi_X6QFwO_lXf21Fsuzy4DSE4wxybOfSCaeiKvUk_zgu8_TmT0Q9HC1vvGnY5lmgEqbaUGlAsDlK55_Zfn9ZIxJslec6IDj2dbeArQ-T01rT1wop2j1gn5orC4jV6o5w63oZJaobdGfMbGZVAVab6rHl-3AHD0ZLxY_-5o3QqXZ9qVpX1VosjKyLhKlA9VrpApMnZJteNyaf6Tim--0l7LNvAA0BhAYXkHY-2lULn1wdsJjAITBkOYm6Qhq2KGcXkbM8YWecdrtwcA',
				},
			},
		);

		console.log(response);
	} catch (error) {
		console.log(error);
	}
}
