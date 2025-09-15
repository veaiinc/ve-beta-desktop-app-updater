// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "NotchDropAddon",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "NotchDropAddon",
            targets: ["NotchDropAddon"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/livekit/client-sdk-swift.git", from: "2.7.2")
    ],
    targets: [
        .target(
            name: "NotchDropAddon",
            dependencies: [
                .product(name: "LiveKit", package: "client-sdk-swift")
            ],
            path: "src"
        )
    ]
)
