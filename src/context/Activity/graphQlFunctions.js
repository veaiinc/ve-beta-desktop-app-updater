import { gql } from '@apollo/client';
export const getSmartFileActivityQuery = gql`
	query GetSmartFileSummary($workflowId: ID!) {
		getSmartFileSummary(workflowId: $workflowId) {
			tenantId
			workflowId
			totalViews
			averageTimeSpent
			totalInteractions
			moduleViewDuration {
				moduleType
				duration
			}
			sectionViewDuration {
				duration
				sectionId
				moduleType
				sectionType
				content
			}
			interaction {
				moduleType
				interactionType
				totalCount
				content
			}
		}
	}
`;

export const getSmartFileViewersQuery = gql`
	query GetSmartFileViewers($workflowId: ID!) {
		getSmartFileViewers(workflowId: $workflowId) {
			_id
			name
			email
			duration
			sessionCount
			sessionIds
			isAnonymus
		}
	}
`;

export const getViewersSessionDetailsQuery = gql`
	query GetSessionSummary($getSessionSummaryId: ID!) {
		getSessionSummary(id: $getSessionSummaryId) {
			_id
			tenantId
			workflowId
			isAnonymus
			clientDetails {
				_id
				email
				name
				location
				countryCode
				device
				browser
				ip
			}
			duration
			moduleViewDuration {
				moduleType
				duration
			}
			sectionViewDuration {
				duration
				sectionId
				moduleType
				sectionType
				content
			}
			interaction {
				moduleType
				interactionType
				totalCount
				content
			}
		}
	}
`;
