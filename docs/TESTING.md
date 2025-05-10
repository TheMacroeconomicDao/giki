# Giki.js Testing Guide

This document outlines the testing strategy and procedures for the Giki.js project.

## Testing Philosophy

Giki.js follows a comprehensive testing approach to ensure reliability and maintainability:

1. **Unit Testing**: Test individual functions and components in isolation
2. **Integration Testing**: Test interactions between modules
3. **End-to-End Testing**: Test complete user flows in a browser environment
4. **Accessibility Testing**: Ensure the application is accessible to all users
5. **Performance Testing**: Verify the application performs well under load

## Test Directory Structure

```
giki/
├── __tests__/                # Jest tests (unit and integration)
│   ├── components/           # Component tests
│   ├── lib/                  # Utility and service tests
│   └── api/                  # API endpoint tests
├── cypress/                  # E2E tests
│   ├── e2e/                  # End-to-end test specs
│   ├── fixtures/             # Test data
│   └── support/              # Support utilities
└── jest.config.js            # Jest configuration
```

## Running Tests

### Unit and Integration Tests

Unit and integration tests use Jest and React Testing Library.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run a specific test file
npm test -- components/markdown-editor
```

### End-to-End Tests

E2E tests use Cypress to simulate real user interactions.

```bash
# Open Cypress UI
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

## Writing Tests

### Unit Test Example

Unit tests should be placed in the `__tests__` directory, mirroring the structure of the code being tested.

```typescript
// __tests__/lib/utils.test.ts
import { formatDate, truncateText } from '../../lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-01-15T12:30:00Z');
      expect(formatDate(date)).toBe('Jan 15, 2023');
    });
    
    it('returns empty string for invalid date', () => {
      expect(formatDate(null)).toBe('');
    });
  });
  
  describe('truncateText', () => {
    it('truncates text longer than specified length', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...');
    });
    
    it('does not truncate text shorter than specified length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });
});
```

### Component Test Example

Component tests use React Testing Library to test component behavior.

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### API Test Example

API endpoints can be tested using supertest:

```typescript
// __tests__/api/pages.test.ts
import { createRequest, createResponse } from 'node-mocks-http';
import { GET } from '../../app/api/pages/route';
import * as pageService from '../../lib/page-service';

jest.mock('../../lib/page-service');

describe('Pages API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('returns pages with 200 status code', async () => {
    const mockPages = [
      { id: '1', title: 'Page 1' },
      { id: '2', title: 'Page 2' }
    ];
    
    (pageService.getPages as jest.Mock).mockResolvedValue(mockPages);
    
    const req = createRequest();
    const res = createResponse();
    
    await GET(req);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ pages: mockPages });
  });
  
  it('handles errors correctly', async () => {
    (pageService.getPages as jest.Mock).mockRejectedValue(new Error('Database error'));
    
    const req = createRequest();
    const res = createResponse();
    
    await GET(req);
    
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ 
      error: { message: 'Database error' } 
    });
  });
});
```

### E2E Test Example

End-to-end tests with Cypress:

```typescript
// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('allows users to log in with Web3', () => {
    // Mock the Web3 provider
    cy.window().then((win) => {
      win.ethereum = {
        request: cy.stub().resolves('0x123...'),
        on: cy.stub(),
        isMetaMask: true
      };
    });
    
    cy.get('[data-testid="connect-wallet-btn"]').click();
    cy.get('[data-testid="user-address"]').should('be.visible');
    cy.get('[data-testid="user-address"]').should('contain', '0x123...');
  });
  
  it('shows error message when wallet is not connected', () => {
    // Mock a failed Web3 connection
    cy.window().then((win) => {
      win.ethereum = {
        request: cy.stub().rejects(new Error('User rejected request')),
        on: cy.stub(),
        isMetaMask: true
      };
    });
    
    cy.get('[data-testid="connect-wallet-btn"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'User rejected request');
  });
});
```

## Test Coverage

We aim for high test coverage, but prioritize testing critical paths and components:

1. **High Priority**:
   - Authentication flows
   - Core data services
   - Wiki page editing
   - API endpoints

2. **Medium Priority**:
   - UI components
   - Utility functions
   - Error handling

3. **Lower Priority**:
   - Visual styling
   - Analytics

To check test coverage:

```bash
npm test -- --coverage
```

A coverage report will be generated in the `coverage` directory.

## Mocking

### API Mocking

Mock API responses using Jest:

```typescript
jest.mock('../../lib/api-utils', () => ({
  fetchApi: jest.fn().mockResolvedValue({
    data: { /* mock data */ }
  })
}));
```

### Component Mocking

When testing components that use context providers:

```typescript
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: { id: '1', name: 'Test User', role: 'admin' },
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false
  };
  
  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Use in tests
render(
  <MockAuthProvider>
    <ComponentToTest />
  </MockAuthProvider>
);
```

## CI/CD Integration

Tests are automatically run in the CI/CD pipeline:

1. **Pull Request**: All tests are run, and coverage is reported
2. **Main Branch**: Tests are run before deployment to staging
3. **Release**: Tests are run before production deployment

## Accessibility Testing

We use the following tools for accessibility testing:

1. **Jest-Axe**: For component-level accessibility tests
2. **Cypress-Axe**: For E2E accessibility tests

Example Jest-Axe test:

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../components/ui/button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance Testing

For performance testing, we use:

1. **Lighthouse**: For overall performance scores
2. **React DevTools Profiler**: For component rendering performance
3. **Custom timing metrics**: For critical user flows

Add performance tests to your Cypress tests:

```typescript
// cypress/e2e/performance.cy.ts
describe('Page Load Performance', () => {
  it('loads the home page in under 3 seconds', () => {
    const start = performance.now();
    cy.visit('/');
    cy.get('[data-testid="main-content"]').should('be.visible').then(() => {
      const end = performance.now();
      const loadTime = end - start;
      expect(loadTime).to.be.lessThan(3000);
    });
  });
});
```

## Troubleshooting Common Test Issues

### Tests Timing Out

If tests are timing out:

1. Check for asynchronous operations not being properly awaited
2. Increase the timeout in Jest configuration:

```javascript
// jest.config.js
module.exports = {
  testTimeout: 10000, // Default is 5000ms
};
```

### Failed API Tests

If API tests are failing:

1. Ensure mocks are properly set up
2. Check for changes in API response structure
3. Verify environment variables are correctly set for testing

### Flaky Tests

For flaky tests:

1. Identify the source of flakiness (async operations, race conditions, etc.)
2. Add proper waiting mechanisms in E2E tests
3. Consider using retry mechanisms for network-dependent tests

## Best Practices

1. **Test in isolation**: Each test should not depend on the results of other tests
2. **Use meaningful assertions**: Make assertions specific and clear
3. **Mock external dependencies**: Isolate the unit under test
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Don't test implementation details**: Test behavior, not how it's implemented
6. **Keep tests fast**: Optimize tests to run quickly
7. **Use data-testid attributes**: Instead of relying on CSS selectors or text content 