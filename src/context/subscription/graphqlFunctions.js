import { gql } from '@apollo/client';

export const sendCustomMailMutation = gql`
	mutation SendCustomMail($clientEmail: [String]!, $mailContent: mailContentInput!) {
		sendCustomMail(clientEmail: $clientEmail, mailContent: $mailContent)
	}
`;
