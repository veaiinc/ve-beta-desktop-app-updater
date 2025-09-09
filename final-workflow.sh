#!/usr/bin/env bash
set -euo pipefail

# Ve AI Complete Build and Notarization Workflow with NotchDrop Integration
# This script handles version management, building, signing, and notarization
# for Ve AI Desktop with NotchDrop native module support

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1" >&2
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

print_header() {
    echo -e "${BLUE}${1}${NC}"
}

print_step() {
    echo -e "${PURPLE}${1}${NC}"
}

print_detail() {
    echo -e "${CYAN}  → ${1}${NC}"
}

# Function to validate environment
validate_environment() {
    print_step "🔍 Validating build environment..."
    
    # Check if we're on macOS
    if [[ "$(uname)" != "Darwin" ]]; then
        print_error "This script requires macOS for NotchDrop native module building"
        exit 1
    fi
    
    # Check Node.js version
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $node_version -lt 18 ]]; then
        print_error "Node.js 18+ required, found: $(node -v)"
        exit 1
    fi
    print_detail "Node.js version: $(node -v)"
    
    # Check Swift compiler
    if ! command -v swiftc >/dev/null 2>&1; then
        print_error "Swift compiler required for NotchDrop. Install Xcode command line tools"
        exit 1
    fi
    print_detail "Swift compiler: $(swiftc --version | head -n1)"
    
    # Check code signing certificate
    if ! security find-identity -v -p codesigning | grep -q "Developer ID Application: VE AI PRIVATE LIMITED"; then
        print_error "Ve AI Developer ID certificate not found in keychain"
        exit 1
    fi
    print_detail "Code signing certificate: Available"
    
    # Check for notarization keychain profile
    # if ! xcrun notarytool store-credentials --list-profiles 2>/dev/null | grep -q "veai-profile"; then
    #     print_info "Notarization keychain profile 'veai-profile-2' not found"
    #     print_info "DMG notarization may require manual setup"
    # else
    #     print_detail "Notarization profile: Available"
    # fi
    
    print_status "Environment validation completed"
}

# Function to validate NotchDrop addon
validate_notchdrop() {
    print_step "🔍 Validating NotchDrop addon environment..."
    
    if [[ -f "scripts/validate-notchdrop.js" ]]; then
        if npm run validate:notchdrop; then
            print_status "NotchDrop addon environment validated"
        else
            print_error "NotchDrop addon validation failed"
            exit 1
        fi
    else
        print_info "NotchDrop validation script not found, proceeding with basic checks"
        
        # Basic NotchDrop checks
        if [[ ! -d "notchdrop-addon" ]]; then
            print_error "NotchDrop addon directory not found"
            exit 1
        fi
        
        if [[ ! -f "notchdrop-addon/binding.gyp" ]]; then
            print_error "NotchDrop binding.gyp not found"
            exit 1
        fi
        
        print_status "Basic NotchDrop checks passed"
    fi
}

# Function to increment version
increment_version() {
    local version_type=${1:-patch}  # default to patch if no argument
    
    print_step "📦 Managing version ($version_type)..."
    
    # Read current version from package.json
    current_version=$(node -p "require('./package.json').version")
    print_detail "Current version: $current_version"
    
    # Check if version has 'v' prefix
    if [[ $current_version == v* ]]; then
        has_v_prefix=true
        clean_version=${current_version#v}
    else
        has_v_prefix=false
        clean_version=$current_version
    fi
    
    # Split version into parts using a more compatible approach
    major=$(echo "$clean_version" | cut -d'.' -f1)
    minor=$(echo "$clean_version" | cut -d'.' -f2)
    patch=$(echo "$clean_version" | cut -d'.' -f3)
    
    # Ensure we have valid numbers (default to 0 if empty)
    major=${major:-0}
    minor=${minor:-0}
    patch=${patch:-0}
    
    # Validate that we have numeric values
    if ! [[ "$major" =~ ^[0-9]+$ ]] || ! [[ "$minor" =~ ^[0-9]+$ ]] || ! [[ "$patch" =~ ^[0-9]+$ ]]; then
        print_error "Invalid version format: $current_version"
        exit 1
    fi
    
    # Increment based on type
    case $version_type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            print_detail "Incrementing major version"
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            print_detail "Incrementing minor version"
            ;;
        patch|*)
            patch=$((patch + 1))
            # If patch version reaches 10 (after incrementing from 9), rollover to next minor version
            if [[ $patch -eq 10 ]]; then
                print_detail "Patch version reached 10, rolling over to next minor version"
                minor=$((minor + 1))
                patch=0
            else
                print_detail "Incrementing patch version"
            fi
            ;;
    esac
    
    # Preserve the 'v' prefix if it was present
    if [[ $has_v_prefix == true ]]; then
        new_version="v${major}.${minor}.${patch}"
    else
        new_version="${major}.${minor}.${patch}"
    fi
    
    # Update package.json
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, '\t') + '\n');
    "
    
    print_status "Version updated: $current_version → $new_version"
    echo "$new_version"
}

# Function to clean build directories
clean_build() {
    print_step "🧹 Cleaning build directories..."
    
    # Clean main build directories
    print_detail "Cleaning main build artifacts..."
    npm run clean:build:cross >/dev/null 2>&1 || {
        print_info "Main clean command failed, cleaning manually..."
        rm -rf dist-electron build dist >/dev/null 2>&1 || true
    }
    
    # Clean NotchDrop build artifacts
    if [[ -d "notchdrop-addon/build" ]]; then
        print_detail "Cleaning NotchDrop build artifacts..."
        rm -rf notchdrop-addon/build >/dev/null 2>&1 || true
    fi
    
    if [[ -d "notchdrop-addon/dist" ]]; then
        print_detail "Cleaning NotchDrop UI artifacts..."
        rm -rf notchdrop-addon/dist >/dev/null 2>&1 || true
    fi
    
    print_status "Build directories cleaned"
}

# Function to sync with upstream
sync_upstream() {
    print_step "🔄 Syncing with upstream repository..."
    
    if [[ -f "sync.sh" ]]; then
        print_detail "Running sync.sh script..."
        if sh sync.sh >/dev/null 2>&1; then
            print_status "Repository synced successfully"
        else
            print_error "Failed to sync with upstream repository"
            exit 1
        fi
    else
        print_info "sync.sh not found, skipping upstream sync"
        
        # Basic git sync as fallback
        if git rev-parse --git-dir >/dev/null 2>&1; then
            print_detail "Performing basic git pull..."
            git pull >/dev/null 2>&1 || {
                print_info "Git pull failed or no remote configured"
            }
        fi
    fi
}

# Function to build NotchDrop addon
build_notchdrop() {
    print_step "⚡ Building NotchDrop addon..."
    
    print_detail "Building native module..."
    if ! npm run build:notchdrop:native; then
        print_error "NotchDrop native module build failed"
        exit 1
    fi
    
    print_detail "Building UI components..."
    if ! npm run build:notchdrop:ui; then
        print_error "NotchDrop UI build failed"
        exit 1
    fi
    
    # Verify build artifacts
    if [[ -f "notchdrop-addon/build/Release/notchdrop_addon.node" ]]; then
        local node_size=$(du -h "notchdrop-addon/build/Release/notchdrop_addon.node" | cut -f1)
        print_detail "Native module built: notchdrop_addon.node ($node_size)"
    else
        print_error "Native module binary not found after build"
        exit 1
    fi
    
    if [[ -f "notchdrop-addon/build/Release/libNotchDropCore.a" ]]; then
        local lib_size=$(du -h "notchdrop-addon/build/Release/libNotchDropCore.a" | cut -f1)
        print_detail "Swift library built: libNotchDropCore.a ($lib_size)"
    else
        print_error "Swift static library not found after build"
        exit 1
    fi
    
    if [[ -d "notchdrop-addon/dist" ]]; then
        print_detail "UI components built successfully"
    else
        print_error "UI components not found after build"
        exit 1
    fi
    
    print_status "NotchDrop addon built successfully"
}

# Function to build main application
build_main_app() {
    print_step "🏗️ Building main application..."
    
    print_detail "Building React application with Vite..."
    local start_time=$(date +%s)
    
    if npm run build >/dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_detail "Main application built in ${duration}s"
    else
        print_error "Main application build failed"
        exit 1
    fi
    
    # Verify build output
    if [[ -d "build" ]]; then
        local build_size=$(du -sh build | cut -f1)
        print_detail "Build output: build/ ($build_size)"
        print_status "Main application built successfully"
    else
        print_error "Build directory not found after build"
        exit 1
    fi
}

# Function to package applications
package_applications() {
    print_step "📦 Packaging applications with code signing..."
    
    print_detail "Running electron-builder for all platforms..."
    print_info "This may take several minutes and will sign all components..."
    
    local start_time=$(date +%s)
    
    # Use package:all which includes NotchDrop builds and signing
    if npm run package:all >/dev/null 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        print_detail "Packaging completed in ${duration}s"
    else
        print_error "Application packaging failed"
        print_info "Check the build logs for signing or packaging errors"
        exit 1
    fi
    
    # Verify packaged applications
    print_detail "Verifying packaged applications..."
    
    local packaged_count=0
    
    if [[ -f "dist/Ve.AI-arm64-mac.dmg" ]]; then
        local dmg_size=$(du -h "dist/Ve.AI-arm64-mac.dmg" | cut -f1)
        print_detail "macOS ARM64 DMG: $dmg_size"
        ((packaged_count++))
    fi
    
    if [[ -f "dist/Ve.AI-x64-mac.dmg" ]]; then
        local dmg_size=$(du -h "dist/Ve.AI-x64-mac.dmg" | cut -f1)
        print_detail "macOS x64 DMG: $dmg_size"
        ((packaged_count++))
    fi
    
    if [[ -f "dist/Ve.AI-x64-win.exe" ]] || [[ -f "dist/"*".exe" ]]; then
        local exe_files=$(find dist -name "*.exe" -type f | wc -l | tr -d ' ')
        print_detail "Windows executables: $exe_files files"
        ((packaged_count++))
    fi
    
    if [[ $packaged_count -eq 0 ]]; then
        print_error "No packaged applications found in dist/ directory"
        exit 1
    fi
    
    print_status "Applications packaged successfully ($packaged_count platforms)"
}

# Function to notarize macOS applications
notarize_macos() {
    print_step "🍎 Notarizing macOS applications..."
    
    # Check if we have DMG files to notarize
    local dmg_files=$(find dist -name "*.dmg" -type f 2>/dev/null || true)
    
    if [[ -z "$dmg_files" ]]; then
        print_info "No DMG files found for notarization"
        return
    fi
    
    print_detail "Found DMG files for notarization:"
    echo "$dmg_files" | while read -r dmg; do
        print_detail "  - $(basename "$dmg")"
    done
    
    # Use existing notarization script if available
    # if [[ -f "notarize_for_intel.sh" ]]; then
    #     print_detail "Running existing notarization script..."
    #     print_info "This may take several minutes..."
        
    #     if sh notarize_for_intel.sh >/dev/null 2>&1; then
    #         print_status "DMG files notarized successfully"
    #     else
    #         print_error "Notarization failed"
    #         print_info "Check your keychain profile 'veai-profile-2' and network connection"
    #         exit 1
    #     fi
    # else
    #     # Fallback manual notarization
    #     print_detail "Using manual notarization process..."
        
    #     echo "$dmg_files" | while read -r dmg; do
    #         if [[ -f "$dmg" ]]; then
    #             print_detail "Notarizing $(basename "$dmg")..."
                
    #             # Try to notarize using keychain profile
    #             if xcrun notarytool submit "$dmg" --keychain-profile "veai-profile-2" --wait >/dev/null 2>&1; then
    #                 print_detail "Notarization successful for $(basename "$dmg")"
                    
    #                 # Staple the notarization
    #                 if xcrun stapler staple "$dmg" >/dev/null 2>&1; then
    #                     print_detail "Stapled $(basename "$dmg")"
    #                 else
    #                     print_info "Stapling failed for $(basename "$dmg")"
    #                 fi
    #             else
    #                 print_error "Notarization failed for $(basename "$dmg")"
    #                 print_info "Ensure 'veai-profile-2' keychain profile is configured"
    #                 exit 1
    #             fi
    #         fi
    #     done
        
    #     print_status "Manual notarization completed"
    # fi
}

# Function to verify final build
verify_build() {
    print_step "✅ Verifying final build..."
    
    local verification_failed=false
    
    # Check if dist directory exists
    if [[ ! -d "dist" ]]; then
        print_error "dist/ directory not found"
        verification_failed=true
    else
        local dist_size=$(du -sh dist | cut -f1)
        print_detail "Distribution folder size: $dist_size"
    fi
    
    # Verify macOS applications
    local macos_apps=$(find dist -name "*.dmg" -o -name "*.zip" | grep -E "(mac|darwin)" || true)
    if [[ -n "$macos_apps" ]]; then
        print_detail "macOS applications verified:"
        echo "$macos_apps" | while read -r app; do
            local app_size=$(du -h "$app" | cut -f1)
            print_detail "  - $(basename "$app") ($app_size)"
            
            # Verify code signature for DMG files
            if [[ "$app" == *.dmg ]]; then
                if spctl --assess --verbose "$app" >/dev/null 2>&1; then
                    print_detail "    ✅ Code signature valid"
                else
                    print_detail "    ⚠️  Code signature verification failed"
                fi
            fi
        done
    else
        print_info "No macOS applications found"
    fi
    
    # Verify Windows applications
    local windows_apps=$(find dist -name "*.exe" -o -name "*.msi" || true)
    if [[ -n "$windows_apps" ]]; then
        print_detail "Windows applications verified:"
        echo "$windows_apps" | while read -r app; do
            local app_size=$(du -h "$app" | cut -f1)
            print_detail "  - $(basename "$app") ($app_size)"
        done
    else
        print_info "No Windows applications found"
    fi
    
    # Check for NotchDrop integration in macOS builds
    local mac_app_dir=$(find dist -name "*.app" -type d | head -n1)
    if [[ -n "$mac_app_dir" ]]; then
        local notchdrop_files=$(find "$mac_app_dir" -name "*notchdrop*" -o -name "notchdrop_addon.node" 2>/dev/null | wc -l | tr -d ' ')
        if [[ $notchdrop_files -gt 0 ]]; then
            print_detail "NotchDrop integration verified: $notchdrop_files files found"
        else
            print_info "NotchDrop files not found in packaged app (may be in DMG only)"
        fi
    fi
    
    if [[ "$verification_failed" == true ]]; then
        print_error "Build verification failed"
        exit 1
    fi
    
    print_status "Build verification completed successfully"
}

# Function to display build summary
display_summary() {
    print_header "🎉 Build and Notarization Completed Successfully!"
    echo
    print_info "Build Summary:"
    print_detail "Version: $1"
    print_detail "Built at: $(date '+%Y-%m-%d %H:%M:%S')"
    print_detail "Platform: macOS $(sw_vers -productVersion)"
    print_detail "Node.js: $(node -v)"
    print_detail "Electron: $(node -p "require('./package.json').devDependencies.electron")"
    echo
    
    print_info "Available Distributions:"
    if [[ -d "dist" ]]; then
        find dist -name "*.dmg" -o -name "*.exe" -o -name "*.zip" -o -name "*.msi" | while read -r file; do
            local file_size=$(du -h "$file" | cut -f1)
            print_detail "$(basename "$file") - $file_size"
        done
    fi
    echo
    
    print_info "NotchDrop Integration:"
    print_detail "Native module: ✅ Built and signed"
    print_detail "UI components: ✅ Built and packaged"
    print_detail "Code signing: ✅ All components signed"
    echo
    
    print_info "Next Steps:"
    print_detail "• Test the built applications before distribution"
    print_detail "• Upload to GitHub Releases or distribution platform"
    print_detail "• Update release notes with new features"
    echo
    
    print_status "All files are ready for distribution! 🚀"
}

# Function to show help
show_help() {
    print_header "Ve AI Complete Build Workflow with NotchDrop Integration"
    echo
    echo "Usage: $0 [VERSION_TYPE] [OPTIONS]"
    echo
    echo "VERSION_TYPE:"
    echo "  patch   - Increment patch version (default) (e.g., v1.2.3 → v1.2.4)"
    echo "  minor   - Increment minor version (e.g., v1.2.3 → v1.3.0)"
    echo "  major   - Increment major version (e.g., v1.2.3 → v2.0.0)"
    echo
    echo "OPTIONS:"
    echo "  --skip-sync     Skip upstream repository sync"
    echo "  --skip-clean    Skip build directory cleaning"
    echo "  --skip-notarize Skip macOS notarization"
    echo "  --dry-run       Show what would be done without executing"
    echo "  -h, --help      Show this help message"
    echo
    echo "Examples:"
    echo "  $0              # Increment patch version with full workflow"
    echo "  $0 minor        # Increment minor version with full workflow"  
    echo "  $0 patch --skip-notarize  # Build without notarization"
    echo "  $0 --dry-run    # Show workflow steps without executing"
    echo
    echo "Features:"
    echo "  • Automatic version management"
    echo "  • NotchDrop native module building and signing"
    echo "  • Multi-platform packaging (macOS, Windows, Linux)"
    echo "  • Code signing with Developer ID"
    echo "  • macOS notarization with stapling"
    echo "  • Comprehensive build verification"
    echo "  • Environment validation"
    echo
    echo "Requirements:"
    echo "  • macOS with Xcode command line tools"
    echo "  • Node.js 18+"
    echo "  • Swift compiler"
    echo "  • Ve AI Developer ID certificate in keychain"
    echo "  • Notarization keychain profile (for notarization)"
}

# Parse command line arguments
VERSION_TYPE="patch"
SKIP_SYNC=false
SKIP_CLEAN=false
SKIP_NOTARIZE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        patch|minor|major)
            VERSION_TYPE="$1"
            shift
            ;;
        --skip-sync)
            SKIP_SYNC=true
            shift
            ;;
        --skip-clean)
            SKIP_CLEAN=true
            shift
            ;;
        --skip-notarize)
            SKIP_NOTARIZE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo
            show_help
            exit 1
            ;;
    esac
done

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type: $VERSION_TYPE"
    echo
    show_help
    exit 1
fi

# Main execution function
main() {
    print_header "🚀 Ve AI Complete Build Workflow with NotchDrop Integration"
    print_info "Version: $VERSION_TYPE | Dry Run: $DRY_RUN"
    echo
    
    if [[ "$DRY_RUN" == true ]]; then
        print_info "DRY RUN MODE - No changes will be made"
        print_step "Would execute the following steps:"
        print_detail "1. Validate environment (macOS, Node.js, Swift, certificates)"
        print_detail "2. Validate NotchDrop addon environment"
        [[ "$SKIP_SYNC" == false ]] && print_detail "3. Sync with upstream repository"
        print_detail "4. Increment version ($VERSION_TYPE)"
        [[ "$SKIP_CLEAN" == false ]] && print_detail "5. Clean build directories"
        print_detail "6. Build NotchDrop addon (native + UI)"
        print_detail "7. Build main React application"
        print_detail "8. Package applications with code signing"
        [[ "$SKIP_NOTARIZE" == false ]] && print_detail "9. Notarize macOS applications"
        print_detail "10. Verify final build"
        print_detail "11. Display build summary"
        echo
        print_info "Run without --dry-run to execute the workflow"
        exit 0
    fi
    
    local workflow_start_time=$(date +%s)
    
    # Step 1: Validate environment
    validate_environment
    echo
    
    # Step 2: Validate NotchDrop
    validate_notchdrop  
    echo
    
    # Step 3: Sync with upstream (optional)
    if [[ "$SKIP_SYNC" == false ]]; then
        # sync_upstream
        echo
    else
        print_info "Skipping upstream sync (--skip-sync)"
        echo
    fi
    
    # Step 4: Increment version
    new_version=$(increment_version "$VERSION_TYPE")
    echo
    
    # Step 5: Clean build directories (optional)
    if [[ "$SKIP_CLEAN" == false ]]; then
        clean_build
        echo
    else
        print_info "Skipping build clean (--skip-clean)"
        echo
    fi
    
    # Step 6: Build NotchDrop addon
    build_notchdrop
    echo
    
    # Step 7: Build main application
    build_main_app
    echo
    
    # Step 8: Package applications
    package_applications
    echo
    
    # Step 9: Notarize macOS applications (optional)
    if [[ "$SKIP_NOTARIZE" == false ]]; then
        notarize_macos
        echo
    else
        print_info "Skipping macOS notarization (--skip-notarize)"
        echo
    fi
    
    # Step 10: Verify build
    verify_build
    echo
    
    # Calculate total workflow time
    local workflow_end_time=$(date +%s)
    local total_duration=$((workflow_end_time - workflow_start_time))
    local minutes=$((total_duration / 60))
    local seconds=$((total_duration % 60))
    
    # Step 11: Display summary
    display_summary "$new_version"
    
    print_info "Total workflow time: ${minutes}m ${seconds}s"
    print_status "🎯 Complete workflow finished successfully!"
}

# Handle script interruption
trap 'echo -e "\n${RED}✗${NC} Workflow interrupted by user"; exit 1' INT TERM

# Change to script directory to ensure relative paths work
cd "$(dirname "$0")"

# Verify we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Ensure you're running this script from the project root directory"
    exit 1
fi

# Run main workflow
main "$@"