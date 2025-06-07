import { gql } from '@apollo/client';

export const getTemplateIdusingSlugQuery = gql`
	query GetTemplateBySlug($slug: String!) {
		getTemplateBySlug(slug: $slug) {
			_id
		}
	}
`;

export const getTemplateIdusingSessionIdQuery = gql`
	query GetTemplateBySessionId($sessionId: ID!) {
		getTemplateBySessionId(sessionId: $sessionId) {
			_id
		}
	}
`;
