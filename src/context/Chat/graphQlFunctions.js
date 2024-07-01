import { gql } from '@apollo/client';
export const getAllUsersFromMetaDataApi = gql`
    query PageUsersList($filters: pageUsersListFiltersInput) {
        pageUsersList(filters: $filters) {
            data {
                _id
                pageId
                userId
                userName
                displayPicture
                lastMessage
                lastMessageAt
                unreadCount
                platform
            }
            hasNextPage
            currentPage
        }
    }
`;

export const getAllUsersConversationApi = gql`
    query GetConversations($filters: ConversationsListFiltersInput) {
        getConversations(filters: $filters) {
            data {
                _id
                pageId
                senderId
                messageText
                readAt
                createdAt
                userType
            }
            hasNextPage
            currentPage
        }
    }
`;

export const markUnreadMessagesApi = gql`
    mutation ResetUnreadCount($pageId: String!, $userId: String!) {
        resetUnreadCount(pageId: $pageId, userId: $userId) {
            message
        }
    }
`;

export const getPageInfoApi = gql`
    query GetPages($filters: pagesListFiltersInput) {
        getPages(filters: $filters) {
            data {
                _id
                userId
                pageId
                pageName
                accessToken
                displayPicture
                fanCount
                workspaceId
            }

            currentPage
            hasNextPage
        }
    }
`;

export const getChatFiltersCountApi = gql`
    query ConversationsDefaultFilters($pageId: String) {
        conversationsDefaultFilters(pageId: $pageId) {
            count
            platform
        }
    }
`;
