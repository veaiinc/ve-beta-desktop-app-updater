{
  "targets": [{
    "target_name": "notchdrop_addon",
    "conditions": [
      ['OS=="mac"', {
                "sources": [
                  "src/notchdrop_addon.mm",
                  "src/NotchDropBridge.m",
                  "src/NotchDropCore.swift",
                  "src/DynamicIslandTheme.swift",
                  "src/NotchView.swift",
                  "src/NotchViewModel.swift",
                  "src/NotchViewModel+Events.swift",
                  "src/NotchContentView.swift",
                  "src/NotchHeaderView.swift",
                  "src/NotchMenuView.swift",
                  "src/NotchSettingsView.swift",
                  "src/ShareView.swift",
                  "src/Share.swift",
                  "src/TrayView.swift",
                  "src/TrayDrop.swift",
                  "src/TrayDrop+DropItem.swift",
                  "src/TrayDrop+DropItemView.swift",
                  "src/PublishedPersist.swift",
                  "src/Language.swift",
                  "src/EventMonitor.swift",
                  "src/EventMonitors.swift",
                  "src/Ext+URL.swift",
                  "src/Ext+NSScreen.swift",
                  "src/Ext+NSImage.swift",
                  "src/Ext+NSAlert.swift",
                  "src/Ext+FileProvider.swift",
                  "src/NotchViewController.swift",
                  "src/NotchCalendarView.swift"
                ],
        "include_dirs": [
          "<!@(node -p \"require('node-addon-api').include\")",
          "include",
          "build_swift"
        ],
        "dependencies": [
          "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        "libraries": [
          "<(PRODUCT_DIR)/libNotchDropCore.a"
        ],
        "cflags!": [ "-fno-exceptions" ],
        "cflags_cc!": [ "-fno-exceptions" ],
        "xcode_settings": {
          "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
          "CLANG_ENABLE_OBJC_ARC": "YES",
          "SWIFT_OBJC_BRIDGING_HEADER": "include/NotchDropBridge.h",
          "SWIFT_VERSION": "5.0",
          "SWIFT_OBJC_INTERFACE_HEADER_NAME": "notchdrop_addon-Swift.h",
          "MACOSX_DEPLOYMENT_TARGET": "11.0",
          "OTHER_CFLAGS": [
            "-ObjC++",
            "-fobjc-arc"
          ],
          "OTHER_LDFLAGS": [
            "-Wl,-rpath,@loader_path",
            "-Wl,-install_name,@rpath/libNotchDropCore.a"
          ],
          "HEADER_SEARCH_PATHS": [
            "$(SRCROOT)/include",
            "$(CONFIGURATION_BUILD_DIR)",
            "$(SRCROOT)/build/Release",
            "$(SRCROOT)/build_swift"
          ]
        },
        "actions": [
                           {
                   "action_name": "build_swift",
                               "inputs": [
              "src/NotchDropCore.swift",
              "src/DynamicIslandTheme.swift",
              "src/NotchView.swift",
              "src/NotchViewModel.swift",
              "src/NotchViewModel+Events.swift",
              "src/NotchContentView.swift",
              "src/NotchHeaderView.swift",
              "src/NotchMenuView.swift",
              "src/NotchSettingsView.swift",
              "src/ShareView.swift",
              "src/Share.swift",
              "src/TrayView.swift",
              "src/TrayDrop.swift",
              "src/TrayDrop+DropItem.swift",
              "src/TrayDrop+DropItemView.swift",
              "src/PublishedPersist.swift",
              "src/Language.swift",
              "src/EventMonitor.swift",
              "src/EventMonitors.swift",
              "src/Ext+URL.swift",
              "src/Ext+NSScreen.swift",
              "src/Ext+NSImage.swift",
              "src/Ext+NSAlert.swift",
              "src/Ext+FileProvider.swift",
              "src/NotchViewController.swift",
              "src/NotchCalendarView.swift"
            ],
            "outputs": [
              "build_swift/libNotchDropCore.a",
              "build_swift/notchdrop_addon-Swift.h"
            ],
            "action": [
              "swiftc",
              "src/NotchDropCore.swift",
              "src/DynamicIslandTheme.swift",
              "src/NotchView.swift",
              "src/NotchViewModel.swift",
              "src/NotchViewModel+Events.swift",
              "src/NotchContentView.swift",
              "src/NotchHeaderView.swift",
              "src/NotchMenuView.swift",
              "src/NotchSettingsView.swift",
              "src/ShareView.swift",
              "src/Share.swift",
              "src/TrayView.swift",
              "src/TrayDrop.swift",
              "src/TrayDrop+DropItem.swift",
              "src/TrayDrop+DropItemView.swift",
              "src/PublishedPersist.swift",
              "src/Language.swift",
              "src/EventMonitor.swift",
              "src/EventMonitors.swift",
              "src/Ext+URL.swift",
              "src/Ext+NSScreen.swift",
              "src/Ext+NSImage.swift",
              "src/Ext+NSAlert.swift",
              "src/Ext+FileProvider.swift",
              "src/NotchViewController.swift",
              "src/NotchCalendarView.swift",
              "-emit-objc-header-path", "./build_swift/notchdrop_addon-Swift.h",
              "-emit-library", "-o", "./build_swift/libNotchDropCore.a",
              "-emit-module", "-module-name", "notchdrop_addon",
              "-module-link-name", "NotchDropCore"
            ]
          },
          {
            "action_name": "copy_swift_lib",
            "inputs": [
              "<(module_root_dir)/build_swift/libNotchDropCore.a"
            ],
            "outputs": [
              "<(PRODUCT_DIR)/libNotchDropCore.a"
            ],
            "action": [
              "sh",
              "-c",
              "cp -f <(module_root_dir)/build_swift/libNotchDropCore.a <(PRODUCT_DIR)/libNotchDropCore.a && install_name_tool -id @rpath/libNotchDropCore.a <(PRODUCT_DIR)/libNotchDropCore.a"
            ]
          }
        ]
      }]
    ]
  }]
}
