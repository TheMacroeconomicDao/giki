# Giki.js - Next-Generation Wiki Platform

Giki.js is a modern, feature-rich wiki platform built with Next.js, featuring blockchain authentication, multilingual support, and a comprehensive content management system.

## 🚀 Key Features

### 🔐 Blockchain Authentication
- **Wallet-Based Authentication**: Secure, passwordless login using crypto wallets
- **Role-Based Access Control**: Granular permissions for viewers, editors, and administrators
- **One-Click Sign-In**: Streamlined authentication process

### 🌐 Multilingual Support
- **AI-Powered Translation**: Automatically translate content to multiple languages
- **One-Click Translation**: Translate your content to all supported languages with a single click
- **Language-Specific Editing**: Create and edit content in any language

### 📄 Content Management
- **Three-Tier Visibility System**:
  - **Public**: Visible to everyone on the internet
  - **Private**: Visible only to the creator
  - **Community**: Visible to all registered users
- **Version Control**: Track changes and restore previous versions
- **Rich Text Editing**: Comprehensive editor with formatting options

### 👥 Collaboration
- **Real-Time Editing**: Multiple users can edit the same document
- **Comments and Discussions**: Engage with other users through comments
- **Activity Tracking**: Monitor recent changes and updates

### ⚙️ Administration
- **Comprehensive Admin Panel**: Manage users, content, and system settings
- **Analytics Dashboard**: Track page views and user activity
- **Backup and Restore**: Protect your data with backup options

## 🛠️ Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Wallet-based authentication (MetaMask, etc.)
- **Translation**: OpenAI API for high-quality translations
- **Styling**: Shadcn UI components for a consistent design

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or another Ethereum wallet for authentication
- OpenAI API key for translation features

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/gikijs.git
   cd gikijs
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Authentication

The system uses wallet-based authentication. Users connect their crypto wallets and sign a message to authenticate. Roles are assigned based on wallet addresses.

### Translation

Translation is powered by the OpenAI API. You need a valid API key to use the translation features. The system supports translating content to multiple languages with a single click.

### Content Visibility

Content can be set to one of three visibility levels:
- **Public**: Visible to everyone, even without logging in
- **Private**: Visible only to the creator
- **Community**: Visible to all authenticated users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [OpenAI](https://openai.com/)
- [MetaMask](https://metamask.io/)
\`\`\`

Let's also create a visibility selector component for the editor:
