//
//  Ext+NSScreen.swift
//  NotchDrop
//
//  Created by 秋星桥 on 2024/7/7.
//

import Cocoa

extension NSScreen {
    var notchSize: CGSize {
        // Guard new APIs on older macOS versions so the addon works pre‑Monterey
        if #available(macOS 12.0, *) {
            let topInset = safeAreaInsets.top
            guard topInset > 0 else { return .zero }
            let fullWidth = frame.width
            let leftPadding = auxiliaryTopLeftArea?.width ?? 0
            let rightPadding = auxiliaryTopRightArea?.width ?? 0
            guard leftPadding > 0, rightPadding > 0 else { return .zero }
            let notchWidth = fullWidth - leftPadding - rightPadding
            return CGSize(width: notchWidth, height: topInset)
        } else {
            // Older macOS has no notch APIs; return .zero so callers use defaults
            return .zero
        }
    }

    var isBuildinDisplay: Bool {
        let screenNumberKey = NSDeviceDescriptionKey(rawValue: "NSScreenNumber")
        guard let id = deviceDescription[screenNumberKey],
              let rid = (id as? NSNumber)?.uint32Value,
              CGDisplayIsBuiltin(rid) == 1
        else { return false }
        return true
    }

    static var buildin: NSScreen? {
        screens.first { $0.isBuildinDisplay }
    }
}
