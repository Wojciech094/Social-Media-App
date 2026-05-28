# Vanilla TypeScript SPA Web App Boilerplate

This repository is a modern boilerplate starter pack for building front-end web applications using TypeScript, ES2025 features, and Vite. It is designed for educational purposes and demonstrates best practices for consuming authenticated APIs, performing CRUD operations, and leveraging the latest advancements in the JavaScript ecosystem.

## Project Assets

- [Production deploy](https://javascript-2-assignment.netlify.app/)
- [Production Deployment Dashboard](https://app.netlify.com/projects/javascript-2-assignment/overview)
- [Lo-Fi Design Spec](https://www.figma.com/design/YeEfWVxR4FyKKovwljxphw/Javascript-2-CA?node-id=0-1&p=f)
- [API URL](https://docs.noroff.dev/docs/v2/social/posts)

## Features

- **TypeScript-first**: Strongly-typed codebase for maintainability and scalability.
- **ES2025+ Syntax**: Utilizes the latest ECMAScript features, including:
  - Routing patterns (URL pattern matching)
  - Dynamic module importing (`import()`)
  - Service Workers for offline support and caching
- **SPA Routing**: Client-side routing for seamless navigation.
- **API Integration**: Example code for consuming authenticated REST APIs.
- **CRUD Operations**: Templates for Create, Read, Update, and Delete actions.
- **Vite-Powered**: Fast development server and optimized production builds.
- **Unit Testing**: Built-in support for unit testing with popular frameworks.
- **Educational Focus**: Clear code structure and comments for learning modern web development.

## Tech Stack

- [Vite](https://nextjs.org/)
- [Animate CSS](https://animate.style/)
- [Cypress](https://www.cypress.io/)
- [Luxon](https://moment.github.io/luxon/#/)
- [Font Awesome](https://fontawesome.com/search?ic=free)
- [Prettier](https://prettier.io/) - An opinionated code formatter
- [Vitest](https://vitest.dev/) - Vite-native unit testing framework

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Nirush4/JavaScript-2-Course-Assignment
   cd javaScript-2-course-assignment
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file:**
   Copy the example below and adjust as needed:

   ```env
   # .env
   VITE_API_BASE_URL=https://api.example.com
   VITE_API_KEY=your_api_key_here
   VITE_AUTH_TOKEN=your_auth_token_here
   VITE_APP_NAME=VanillaTSApp
   ```

   > **Note:** All environment variables prefixed with `VITE_` are exposed to your client-side code.

4. **Start the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
├── index.html              # Main HTML entry point
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── public/                 # Static assets
│   └── vite.svg
├── src/                    # Source code
│   ├── main.ts             # App entry point
│   ├── style.css           # Styles
│   ├── typescript.svg      # Example asset
│   └── vite-env.d.ts       # Vite environment types
└── .env                    # Environment variables (not committed)
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author 👨‍💻​

• Nirushan Rajamanoharan (@Nirush4)

**Happy coding!**
