#!/bin/bash

# Enhanced NotchDrop Addon Build Script
# This script builds the native addon with all SwiftUI components

set -e

echo "🚀 Building Enhanced NotchDrop Addon..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This addon only works on macOS"
    exit 1
fi

# Check macOS version
MACOS_VERSION=$(sw_vers -productVersion)
print_status "macOS version: $MACOS_VERSION"

# Check if Xcode Command Line Tools are installed
if ! command -v xcode-select &> /dev/null; then
    print_error "Xcode Command Line Tools not found. Please install them first:"
    echo "xcode-select --install"
    exit 1
fi

# Check Swift version
if ! command -v swiftc &> /dev/null; then
    print_error "Swift compiler not found. Please install Xcode Command Line Tools."
    exit 1
fi

SWIFT_VERSION=$(swiftc --version | head -n 1)
print_status "Swift version: $SWIFT_VERSION"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js first."
    exit 1
fi

NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm not found. Please install npm first."
    exit 1
fi

NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

print_success "All prerequisites met!"

# Clean previous builds
print_status "Cleaning previous builds..."
if [ -d "build" ]; then
    rm -rf build
    print_success "Cleaned build directory"
fi

if [ -d "build_swift" ]; then
    rm -rf build_swift
    print_success "Cleaned Swift build directory"
fi

if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "Cleaned node_modules"
fi

# Install dependencies
print_status "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Create necessary directories
print_status "Creating build directories..."
mkdir -p build_swift
mkdir -p build/Release
print_success "Build directories created"

# Build the addon
print_status "Building native addon..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Native addon built successfully!"
else
    print_error "Failed to build native addon"
    exit 1
fi

# Verify build artifacts
print_status "Verifying build artifacts..."

if [ -f "build/Release/notchdrop_addon.node" ]; then
    print_success "Native addon binary created"
else
    print_error "Native addon binary not found"
    exit 1
fi

if [ -f "build_swift/libNotchDropCore.a" ]; then
    print_success "Swift library created"
else
    print_warning "Swift library not found (this might be normal)"
fi


# Create distribution package
print_status "Creating distribution package..."
mkdir -p dist
cp -r build/Release/* dist/
cp package.json dist/
cp index.js dist/

print_success "Distribution package created in dist/"

# Final summary
echo ""
echo "🎉 Build completed successfully!"
echo "================================"
echo ""
echo "📁 Build artifacts:"
echo "   - Native addon: build/Release/notchdrop_addon.node"
echo "   - Swift library: build_swift/libNotchDropCore.a"
echo "   - Distribution: dist/"
echo ""
echo ""
echo "📦 To install in parent project:"
echo "   npm install"
echo ""
echo "🚀 Ready for integration with Electron!"
