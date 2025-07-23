# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n custom node project for CigoTracker integration. Custom nodes in n8n allow extending the platform with new integrations and functionality.

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Build the node
npm run build

# Build in watch mode for development
npm run dev

# Link node locally for testing in n8n
npm link
cd ~/.n8n/custom-extensions && npm link n8n-nodes-cigotracker

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run typecheck
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npm test -- path/to/test.spec.ts
```

## Architecture

### Directory Structure
- `src/` - Source code
  - `nodes/` - Node implementations
    - `CigoTracker/` - Main CigoTracker node
      - `CigoTracker.node.ts` - Node definition and logic
      - `CigoTracker.node.json` - Node metadata and UI configuration
  - `credentials/` - Credential type definitions
    - `CigoTrackerApi.credentials.ts` - API credential handling
- `test/` - Test files
- `dist/` - Compiled output (generated)

### Key Components

1. **Node Class** (`CigoTracker.node.ts`): Implements INodeType interface with:
   - `description`: Node metadata and parameters
   - `execute()`: Main execution logic for regular nodes
   - `trigger()`: For trigger nodes that wait for events

2. **Credentials** (`CigoTrackerApi.credentials.ts`): Defines authentication fields and methods

3. **package.json**: Declares the node in `n8n.nodes` array

## Development Guidelines

### Creating Operations
Operations should be defined in the node's `properties` array with clear resource/operation structure:
- Use `resource` and `operation` pattern for organizing functionality
- Implement proper error handling with try-catch blocks
- Return data in n8n's expected format: `[{ json: data }]`

### API Integration
- Use n8n's built-in helpers: `this.helpers.request()` or `this.helpers.httpRequest()`
- Handle pagination using `this.helpers.requestAllItems()`
- Implement proper authentication using credentials

### Testing Locally
1. Build the node: `npm run build`
2. Link it: `npm link && cd ~/.n8n/custom-extensions && npm link n8n-nodes-cigotracker`
3. Start n8n: `n8n start`
4. Find your node in the node panel under "CigoTracker"