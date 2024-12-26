# Developer Guide

        ## Project Structure

        The project is structured as follows:

        -   `src/`: Contains the source code for the application.
            -   `components/`: React components for the UI.
            -   `utils/`: Utility functions for encryption, caching, etc.
            -   `App.jsx`: Main application component.
            -   `index.css`: Global styles.
            -   `main.jsx`: Entry point for the React application.
        -   `__tests__/`: Integration tests.
        -   `docs/`: Developer documentation.
        -   `public/`: Static assets.
        -   `index.html`: HTML template.
        -   `package.json`: Project metadata and dependencies.
        -   `vite.config.js`: Vite configuration.

        ## Components

        ### AccountList

        Displays a list of added accounts. Allows selecting and removing accounts.

        ### EmailList

        Displays a list of emails for the selected account.

        ### Settings

        Allows configuring application settings like API call limits, sync intervals, and concurrent connections. Settings are now displayed in seconds instead of milliseconds. The input boxes directly reflect the current value.

        ### ProxySettings

        Allows configuring proxy settings for API calls. The application now uses these settings when making API calls.

        ### Logs

        Displays application logs.

        ### EmailSearch

        Provides a search bar and filter options for searching emails.

        ### EmailViewer

        Displays a list of downloaded emails and allows searching, filtering, and deleting emails.

        ### AuthSection

        Handles the authentication logic and displays the "Add Account" and "Logout" buttons.

        ### SyncSection

        Handles the background syncing logic and displays the "Start Sync" button.

        ### LogSection

        Displays application logs.

        ## Utility Functions

        ### encryption.js

        Provides functions for encrypting and decrypting data using AES encryption.

        ### cache.js

        Provides functions for caching data in local storage with an expiration time.

        ## State Management

        The application uses React's `useState` and `useEffect` hooks for managing state. Global state is managed within the `App` component and passed down to child components as props.

        ## API Interactions

        The application interacts with the Microsoft Graph API to fetch emails and user data. The `initializeGraphClient` function sets up the API client with the necessary authentication and proxy settings.

        ## File System Operations

        Emails are saved to the file system as `.eml` files in the `emails` directory. Each account has its own subfolder named after the account's username. Emails are saved with the naming format: `Senderemail_Subject_Date.eml`. The `saveEmailToFile` function handles saving emails, and the `EmailViewer` component handles reading and deleting emails from the file system.

        ## Background Syncing

        The application supports background syncing of emails. The `startBackgroundSync` function uses `setInterval` to periodically fetch emails based on the configured sync interval. Random delays are added between API calls to simulate human behavior and avoid account blocks. The `concurrentConnections` setting limits the number of concurrent API calls.

        ## Error Handling

        Errors are handled using try-catch blocks and logged to the console. User-friendly error messages are displayed in the UI using the `Logs` component.

        ## Testing

        The application uses Jest and React Testing Library for testing. Unit tests are located in the `src` directory alongside the components and utility functions they test. Integration tests are located in the `__tests__` directory.

        ## Extending the Application

        To add new features or components, follow these guidelines:

        1. Create new components in the `src/components` directory.
        2. Create new utility functions in the `src/utils` directory.
        3. Write unit tests for new components and utility functions.
        4. Update the `App` component to include new components and functionality.
        5. Update the documentation to reflect the changes.
