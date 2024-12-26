# Email Downloader

        ## Overview

        This application is an email downloader that allows users to download emails from their Microsoft accounts (Outlook and Hotmail). It supports multiple accounts, OAuth for authentication, and various settings to manage API usage and prevent account locks.

        ## Features

        -   **Microsoft OAuth Integration**: Securely authenticate with Microsoft accounts.
        -   **Multiple Account Support**: Add and manage multiple email accounts.
        -   **Configurable Settings**: Adjust timers, API call limits, and sync intervals.
        -   **Proxy Support**: Option to use a proxy for API calls.
        -   **Background Syncing**: Periodically sync emails in the background.
        -   **Email Search and Filtering**: Search and filter downloaded emails.
        -   **Email Deletion**: Delete emails from the server and locally.
        -   **Visual Feedback**: Real-time status updates and logging.
        -   **Caching**: API responses are cached to improve performance.
        -   **Secure Storage**: Sensitive data is encrypted before being stored.
        -   **Concurrent Connections**: Limit the number of concurrent API connections.
        -   **Logout**: Ability to log out and revoke tokens.

        ## Setup

        1. **Clone the repository**:

            ```bash
            git clone <repository-url>
            cd <repository-directory>
            ```

            
        2. **Install Dependencies**:

            ```bash
            npm install
            ```

        3. **Environment Configuration**:
            -   Set your Microsoft OAuth client ID in `src/App.jsx`.
            -   Configure any other necessary environment variables.

        ## Usage

        1. **Run the Application**:

            ```bash
            npm run dev
            ```

            This will start the development server, and you can access the application in your web browser (usually at `http://localhost:5173`).

        2. **Adding an Account**:
            -   Click the "Add Account" button on the main page.
            -   Log in with your Microsoft account.
            -   Grant the necessary permissions to the application.

        3.  **Logging Out**:
            -   Click the "Logout" button on the main page to log out and revoke tokens.

        4. **Selecting an Account**:
            -   Go to the "Accounts" tab.
            -   Click the "Select" button next to the account you want to use.

        5. **Configuring Settings**:
            -   Go to the "Settings" tab.
            -   Adjust the following settings as needed:
                -   **Min Wait Time (s)**: Minimum time to wait between API calls. Default is 3 seconds.
                -   **Max Wait Time (s)**: Maximum time to wait between API calls. Default is 10 seconds.
                -   **API Call Limit**: Maximum number of API calls to make in a single sync. Default is 5.
                -   **Sync Interval (s)**: How often to sync emails in the background. Default is 600 seconds (10 minutes).
                -   **Concurrent Connections**: Limit the number of concurrent API connections. Default is 1.
            -   Click the "Reset to Default" button to reset all settings to their default values.
            -   Click the "Show Proxy Settings" button to configure proxy settings.

        6. **Setting up a Proxy**:
            -   Go to the "Settings" tab and click "Show Proxy Settings".
            -   Enter your proxy settings:
                -   **Host**: Proxy server hostname or IP address.
                -   **Port**: Proxy server port.
                -   **Username**: Proxy username (if required).
                -   **Password**: Proxy password (if required).
            -   The application will now use these settings when making API calls.

        7.  **Viewing Logs**:
            -   Go to the "Logs" section at the bottom of the page to see a log of application events and errors.

        8. **Viewing Emails**
            -   Go to the "Emails" tab to see the emails that have already been downloaded.
            -   Use the search bar to search for specific emails.
            -   Use the filter dropdown to filter emails by subject, sender, or body.
            -   Emails are saved in the `emails` directory, with subfolders named after the account's username.
            -   Emails are saved as `.eml` files, with the naming format: `Senderemail_Subject_Date.eml`.

        9. **Deleting Emails**
            -   In the "Emails" tab, click the "Delete" button next to an email to delete it from both the server and locally.

        ## Troubleshooting

        -   **Authentication Issues**: If you encounter issues during authentication, ensure that your Microsoft OAuth client ID is correctly set in `src/App.jsx` and that the redirect URI is configured correctly in your Microsoft app registration.
        -   **API Errors**: If you see errors related to API calls, check the "Logs" section for more information. You may need to adjust the API call limit or wait times in the "Settings" tab.
        -   **File System Errors**: If you encounter errors related to file system operations, ensure that the application has the necessary permissions to read and write files in the `emails` directory.

        ## Contributing

        Contributions are welcome. Please fork the repository and submit a pull request with your proposed changes.

        ## License

        [Specify License Here]

        ## Contact

        [Your Name/Contact Information]
