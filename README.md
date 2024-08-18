# Software
Requires
 - Preferrably a Linux machine to run this code.
 - NodeJS 18 or above (preferrably use nvm to manage npm and node).

# Original template: Remix Indie Stack
Created with:
```sh
npx create-remix@latest --template remix-run/indie-stack
```

## Handbook

### Local Testing

- Initial setup:
  ```sh
  npm install
  ```
  
  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

- The terminal/command line will display the web address served. Navigate to the given address in your local browser:
  ```sh
  Example display:
  [remix-serve] http://localhost:3000 (http://172.23.55.95:3000)
  ```

- Use the following wallet address to test the inscription interface (hardcoded, other addresses will not work):
  ```sh
  DK24VY9rop9NoHaM8iBAUTNAkVgRXuChVa
  ```

- To clean up the mock transaction data, stop the app and enter the following command in the project folder:
  ```sh
  npx prisma db seed
  ```

This runs the app in development mode, rebuilding assets on file changes.

### Relevant code:

- CRUD operations are programmed in the following file:
  1. FakeWallet, and FakeInscription data: [./app/models/inscription.server.ts]

- Inscription front-end logic:
  1. Main interface: [./app/routes/inscription._index.tsx, ./app/routes/inscription.list.tsx]
  2. Inscription details: [./app/routes/inscription.$inscriptionId.tsx]

### Considerations & Notes:
- For ease of testing, I have kept the .env file available:
  ```sh
  DATABASE_URL="file:./data.db?connection_limit=1"
  SESSION_SECRET="47f3287bb4d7bd4959dd753cdb3cc3ef"
  ```

- Front-end design:
  1. Attempted to closely match the company color scheme, from website: https://doggyfi.xyz
  
- The inscripion interface displays all transactions on file for ease of validation. In real projects, the program should consider:
  1. Validate user data and allow users to only see their own transaction records.
  2. Display only, say, top 100 recent transactions on page load. Complete data should be displayed in a separate, paginated dashboard.

- I used sqlite to store mock inscription transaction data in this demo assignment. In real blockchain applications, we should consider:
  1. Saving only the hash data from user transactions in DB, and querying the transaction details directly from the blockchain when requested.

- We may also need to consider having the inscription interface support bulk inscriptions, for system efficiency.

## What's in the stack
- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create doggy-inscription-da37
  fly apps create doggy-inscription-da37-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app doggy-inscription-da37
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app doggy-inscription-da37-staging
  ```

  If you don't have openssl installed, you can also use [1Password](https://1password.com/password-generator) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app doggy-inscription-da37
  fly volumes create data --size 1 --app doggy-inscription-da37-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

None

## Other Tools

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

This project uses [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
