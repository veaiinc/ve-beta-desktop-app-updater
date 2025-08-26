import AppKit
import Cocoa
import SwiftUI

@objc public class NotchViewController: NSHostingController<NotchView> {
    @objc public init(_ vm: NotchViewModel) {
        super.init(rootView: .init(vm: vm))
    }

    @available(*, unavailable)
    required init?(coder _: NSCoder) {
        fatalError()
    }
}
