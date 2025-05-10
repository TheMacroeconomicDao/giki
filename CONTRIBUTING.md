# Giki.js Contributing Guide

## 👋 Getting Started

1. **Fork the repository**
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/giki.git
   cd giki
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment**:
   - Create a `.env` file based on the description in README.md
   - Run a local database or use Docker
5. **Create a branch for your changes**:
   ```bash
   git checkout -b feature/my-awesome-feature
   ```

## 🤝 Code Guidelines

### Coding Style

- Use TypeScript wherever possible
- Follow functional programming principles
- Adhere to the existing project structure

### Linting

The project uses ESLint for code checking:

```bash
# Run linter
npm run lint

# Auto-fix problems
npm run lint:fix
```

### Formatting

Prettier is used for formatting:

```bash
# Check formatting
npm run format:check

# Auto-format
npm run format
```

### Type Safety

- Avoid using the `any` type
- Define interfaces for all data objects
- Use strict typing (strict mode)

## 📋 Development Process

1. **Choose a task** from [TASKS.md](./TASKS.md) or create a new one
2. **Discuss your approach** in an issue before working on major changes
3. **Write tests** for new functionality
4. **Document changes** in the appropriate README files

## 🔎 Pull Requests

### Checklist Before Submitting a PR

- [ ] Code follows style guidelines
- [ ] Linter passes without errors
- [ ] Types are complete and correct
- [ ] Tests are written
- [ ] Documentation is updated
- [ ] Code does not contain secrets and personal data
- [ ] Changes do not break existing functionality

### PR Template

```markdown
## Description
[Brief description of your PR]

## Related issues
Closes #[issue number]

## Type of changes
- [ ] New feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Documentation changes
- [ ] Other: [describe]

## Checklist
- [ ] Code follows project style
- [ ] Tests added or updated
- [ ] Documentation updated

## Screenshots (if applicable)
[Insert screenshots here]
```

## 🧪 Testing

### Test Types

- **Unit tests**: tests for individual functions and components
- **Integration tests**: tests for interactions between modules
- **E2E tests**: tests simulating user behavior

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- -t "test name"

# Run E2E tests
npm run test:e2e
```

## 📝 Documentation

When making changes, update the corresponding documentation:

- Changes to API: update [docs/API.md](./docs/API.md)
- Changes to UI components: update README in the component directory
- New dependencies: update the "Technologies" section in the main README.md

## 🎯 Decision Making Process

1. **Proposal**: create an issue with the change proposal
2. **Discussion**: gather feedback from the team
3. **Implementation**: create a PR with the implementation
4. **Review**: get approval from at least one core developer
5. **Merge**: after successful review, changes will be accepted

## 🌟 Contribution Recognition

All contributors are added to the "Contributors" section in the main README.md. Significant contributions may be recognized in releases and the authors list.

## 💬 Communication

- **Issues**: for discussing bugs and features
- **Pull Requests**: for discussing code
- **Discussions**: for general questions and ideas

## 📜 Code of Conduct

The project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) code of conduct. By participating in the project, you agree to abide by its terms. 