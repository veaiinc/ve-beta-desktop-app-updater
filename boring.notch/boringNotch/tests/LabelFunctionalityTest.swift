import XCTest
@testable import boringNotch

final class LabelFunctionalityTest: XCTestCase {
    
    func testLabelViewModelIntegration() {
        // Test that EmailViewModel can handle label operations
        let viewModel = EmailViewModel(service: MockMailService(), limit: 10)
        
        // Test initial state
        XCTAssertTrue(viewModel.availableLabels.isEmpty)
        XCTAssertNil(viewModel.selectedLabel)
        XCTAssertFalse(viewModel.isLabelSelected)
        XCTAssertEqual(viewModel.currentSelectionDisplayName, "Inbox")
    }
    
    func testLabelSelection() async {
        let viewModel = EmailViewModel(service: MockMailService(), limit: 10)
        
        // Test label selection
        await viewModel.selectLabel("Test Label")
        XCTAssertEqual(viewModel.selectedLabel, "Test Label")
        XCTAssertTrue(viewModel.isLabelSelected)
        XCTAssertEqual(viewModel.currentSelectionDisplayName, "Test Label")
        
        // Test clearing selection
        await viewModel.clearLabelSelection()
        XCTAssertNil(viewModel.selectedLabel)
        XCTAssertFalse(viewModel.isLabelSelected)
        XCTAssertEqual(viewModel.currentSelectionDisplayName, "Inbox")
    }
    
    func testDuplicateLabelSelection() async {
        let viewModel = EmailViewModel(service: MockMailService(), limit: 10)
        
        // Select a label
        await viewModel.selectLabel("Test Label")
        XCTAssertEqual(viewModel.selectedLabel, "Test Label")
        
        // Select the same label again (should not cause issues)
        await viewModel.selectLabel("Test Label")
        XCTAssertEqual(viewModel.selectedLabel, "Test Label")
    }
}

// MARK: - Mock Mail Service for Testing

class MockMailService: MailService {
    func fetchRecentEmails(limit: Int) async throws -> [EmailItem] {
        return [
            EmailItem(
                appleScriptID: "msg_1",
                subject: "Test Email",
                senderName: "Test Sender",
                senderAddress: "test@example.com",
                preview: "Test preview",
                receivedDate: Date(),
                isRead: false,
                mailboxName: "Inbox",
                messageIDHeader: nil,
                profilePictureData: nil
            )
        ]
    }
    
    func openEmail(_ email: EmailItem) async throws {
        // Mock implementation
    }
    
    func fetchLabels() async throws -> [String] {
        return ["Work", "Personal", "Important", "Archive"]
    }
    
    func fetchEmailsForLabel(_ label: String, limit: Int) async throws -> [EmailItem] {
        return [
            EmailItem(
                appleScriptID: "msg_1",
                subject: "Test Email for \(label)",
                senderName: "Test Sender",
                senderAddress: "test@example.com",
                preview: "Test preview for \(label)",
                receivedDate: Date(),
                isRead: false,
                mailboxName: label,
                messageIDHeader: nil,
                profilePictureData: nil
            )
        ]
    }
}
