import React, { useState, useEffect } from 'react';
    import { getCachedData, setCachedData } from '../utils/cache';
    import EmailSearch from './EmailSearch';
    import { initializeGraphClient } from '../App';
    import LoadingIndicator from './LoadingIndicator';
    import EmailDetails from './EmailDetails';

    const EmailViewer = ({ selectedAccount }) => {
      const [emails, setEmails] = useState([]);
      const [filteredEmails, setFilteredEmails] = useState([]);
      const [loading, setLoading] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterType, setFilterType] = useState('subject');
      const [error, setError] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [emailsPerPage, setEmailsPerPage] = useState(5);
      const [selectedEmail, setSelectedEmail] = useState(null);

      useEffect(() => {
        if (selectedAccount) {
          loadEmails(selectedAccount);
        }
      }, [selectedAccount]);

      const loadEmails = async (account) => {
        setLoading(true);
        const accountIdentifier = account.username.replace(/[^a-zA-Z0-9]/g, '-');
        const cacheKey = `emails-${accountIdentifier}`;
        let cachedEmails = getCachedData(cacheKey);

        if (!cachedEmails) {
          cachedEmails = await fetchEmailsFromLocalStorage(accountIdentifier);
          setCachedData(cacheKey, cachedEmails);
        }

        setEmails(cachedEmails);
        setFilteredEmails(cachedEmails);
        setLoading(false);
      };

      const fetchEmailsFromLocalStorage = async (accountIdentifier) => {
        const emailDir = `emails/${accountIdentifier}`;
        const fs = require('fs').promises;
        let emailFiles = [];
        try {
          emailFiles = await fs.readdir(emailDir);
        } catch (error) {
          console.error('Error reading email directory:', error);
          setError(`Error reading email directory: ${error.message}`);
          return [];
        }

        const emails = [];
        for (const file of emailFiles) {
          if (file.endsWith('.eml')) {
            try {
              const filePath = `${emailDir}/${file}`;
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const emailData = parseEmailData(fileContent);
              emails.push({
                id: file, // Using filename as a unique identifier
                ...emailData,
                accountIdentifier,
                filePath,
              });
            } catch (error) {
              console.error(`Error reading email file ${file}:`, error);
              setError(`Error reading email file ${file}: ${error.message}`);
            }
          }
        }

        return emails;
      };

      const parseEmailData = (content) => {
        const fromMatch = content.match(/From: (.+)/);
        const subjectMatch = content.match(/Subject: (.+)/);
        const receivedMatch = content.match(/Received: (.+)/);

        return {
          from: fromMatch ? fromMatch[1] : 'Unknown',
          subject: subjectMatch ? subjectMatch[1] : 'No Subject',
          received: receivedMatch ? receivedMatch[1] : 'Unknown',
          body: content,
        };
      };

      const handleSearch = (searchTerm, filterType) => {
            setSearchTerm(searchTerm);
            setFilterType(filterType);
            const filtered = emails.filter(email => {
                const term = searchTerm.toLowerCase();
                switch (filterType) {
                    case 'subject':
                    return email.subject.toLowerCase().includes(term);
                    case 'sender':
                    return email.from.toLowerCase().includes(term);
                    case 'body':
                    return email.body.toLowerCase().includes(term);
                    default:
                    return true;
                }
            });
            setFilteredEmails(filtered);
            setCurrentPage(1);
        };

        const handleSearchChange = (event) => {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);
            handleSearch(newSearchTerm, filterType);
        };

        const handleFilterChange = (event) => {
            const newFilterType = event.target.value;
            setFilterType(newFilterType);
            handleSearch(searchTerm, newFilterType);
        };

      const handleDelete = async (emailId) => {
        setLoading(true);
        const emailToDelete = emails.find(email => email.id === emailId);
        if (!emailToDelete) return;

        try {
          // Delete from server
          await deleteEmailFromServer(selectedAccount, emailToDelete);

          // Delete locally
          const fs = require('fs').promises;
          await fs.unlink(emailToDelete.filePath);

          // Update local cache and state
          const updatedEmails = emails.filter(email => email.id !== emailId);
          setEmails(updatedEmails);
          setFilteredEmails(updatedEmails);
          const accountIdentifier = selectedAccount.username.replace(/[^a-zA-Z0-9]/g, '-');
          const cacheKey = `emails-${accountIdentifier}`;
          setCachedData(cacheKey, updatedEmails);

          console.log(`Email deleted: ${emailId}`);
        } catch (error) {
          console.error('Error deleting email:', error);
          setError(`Error deleting email: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      const deleteEmailFromServer = async (account, email) => {
        try {
          const client = await initializeGraphClient(account);
          const emailId = email.id.replace(/\.eml$/, '');
          await client.api(`/me/messages/${emailId}`).delete();
        } catch (error) {
          console.error(`Error deleting email from server: ${email.id}`, error);
          setError(`Error deleting email from server: ${error.message}`);
          throw error;
        }
      };

      const handleViewEmail = (email) => {
        setSelectedEmail(email);
      };

      const handleCloseEmailDetails = () => {
        setSelectedEmail(null);
      };

      const indexOfLastEmail = currentPage * emailsPerPage;
      const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
      const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);

      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(filteredEmails.length / emailsPerPage); i++) {
        pageNumbers.push(i);
      }

      return (
        <div className="email-viewer">
          <EmailSearch onSearch={handleSearch} />
          <LoadingIndicator isLoading={loading} message="Loading emails..." />
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <ul>
                {currentEmails.map(email => (
                  <li key={email.id}>
                    <p><strong>From:</strong> {email.from}</p>
                    <p><strong>Subject:</strong> {email.subject}</p>
                    <p><strong>Received:</strong> {email.received}</p>
                    <div>
                      <button onClick={() => handleViewEmail(email)}>View</button>
                      <button onClick={() => handleDelete(email.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pagination">
                {pageNumbers.map(number => (
                  <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                    {number}
                  </button>
                ))}
              </div>
            </>
          )}
          {selectedEmail && <EmailDetails email={selectedEmail} onClose={handleCloseEmailDetails} />}
        </div>
      );
    };

    export default EmailViewer;
