# Weaver

An in-browser visual programming environment for prototyping and experimenting with AI agents. Weaver enables hobbyists and researchers to create, test, and share agent workflows without the complexity of traditional orchestration frameworks. Features include:

- Interactive agent testing through in-browser visual editing and execution
- Node configuration through the bottom panel
- Visual flow control using structured outputs, no coding required
- Built-in vector database integration for adding memory to agents
- JSON import/export functionality for sharing experiments
- Visual indication of control flow for agent observation

## Tech Stack

- **Node**: 10.8.2
- **Framework**: Next.js
- **Language**: TypeScript
- **UI**: React
- **Styling**: Tailwind
- **State Management**: Zustand
- **Database**: PGLite
- **Development Tools**: ESLint, Prettier

## Getting Started

1. **Prerequisites**

    - npm

2. **Installation**

    ```bash
    # Clone the repository
    git clone https://github.com/PS-Soundwave/weaver.git
    cd weaver

    # Install dependencies
    npm install
    ```

3. **Development**

    ```bash
    # Start the development server
    npm run dev
    ```

    The application will be available at `http://localhost:3000`

4. **Build**

    ```bash
    # Create a production build
    npm run build

    # Start the production server
    npm start
    ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to contribute to this project.
