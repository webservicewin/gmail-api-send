/**
 * Sends multiple emails in a batch using Gmail API
 * @param {Array} emailsData - Array of objects containing email information
 * @param {string} emailsData[].to - Recipient email address
 * @param {string} emailsData[].subject - Email subject
 * @param {string} emailsData[].body - Email body (can be HTML)
 * @param {Array} [emailsData[].cc] - Optional CC recipients
 * @param {Array} [emailsData[].bcc] - Optional BCC recipients
 * @param {Array} [emailsData[].attachments] - Optional attachments (Blob objects)
 * @return {Object} Response with success count and failures
 */
function sendEmailsBatch(emailsData) {
  // Check input data
  if (!Array.isArray(emailsData) || emailsData.length === 0) {
    throw new Error('Invalid email data: Expected non-empty array');
  }
  
  const batch = Gmail.newBatchRequest();
  const results = {
    success: 0,
    failures: [],
    responses: []
  };
  
  // Add each email to the batch
  emailsData.forEach((emailData, index) => {
    try {
      // Validate required fields
      if (!emailData.to || !emailData.subject) {
        throw new Error(`Email at index ${index} missing required fields`);
      }
      
      // Create the email message
      const message = createEmailMessage(emailData);
      
      // Add to batch
      batch.add(Gmail.Users.Messages.send(
        { 'raw': message },
        'me'
      ), { id: index });
      
    } catch (error) {
      results.failures.push({
        index: index,
        error: error.toString(),
        emailData: emailData
      });
    }
  });
  
  // Execute batch if we have valid requests
  if (batch.size() > 0) {
    try {
      const responses = batch.execute();
      
      // Process responses
      if (responses && responses.length > 0) {
        responses.forEach((response, i) => {
          if (response && response.id) {
            results.success++;
            results.responses.push({
              index: parseInt(response.id),
              messageId: response.result.id,
              threadId: response.result.threadId
            });
          }
        });
      }
    } catch (error) {
      Logger.log('Batch execution error: ' + error.toString());
      results.failures.push({
        error: 'Batch execution failed: ' + error.toString()
      });
    }
  }
  
  return results;
}

/**
 * Creates a properly formatted email message for the Gmail API
 * @param {Object} emailData - Email information
 * @return {string} Base64 encoded email message
 */
function createEmailMessage(emailData) {
  const userEmail = Session.getActiveUser().getEmail();
  
  // Create email parts
  let email = "From: " + userEmail + "\r\n" +
              "To: " + emailData.to + "\r\n";
  
  // Add CC if provided
  if (emailData.cc && emailData.cc.length > 0) {
    email += "Cc: " + emailData.cc.join(',') + "\r\n";
  }
  
  // Add BCC if provided
  if (emailData.bcc && emailData.bcc.length > 0) {
    email += "Bcc: " + emailData.bcc.join(',') + "\r\n";
  }
  
  // Add subject
  email += "Subject: " + emailData.subject + "\r\n";
  
  // Set content type - default to HTML
  email += "Content-Type: text/html; charset=UTF-8\r\n\r\n";
  
  // Add body
  email += emailData.body;
  
  // Handle attachments if present
  if (emailData.attachments && emailData.attachments.length > 0) {
    const boundary = "boundary_" + Utilities.getUuid();
    
    // Rewrite the email with multipart content for attachments
    email = "From: " + userEmail + "\r\n" +
            "To: " + emailData.to + "\r\n";
    
    if (emailData.cc && emailData.cc.length > 0) {
      email += "Cc: " + emailData.cc.join(',') + "\r\n";
    }
    
    if (emailData.bcc && emailData.bcc.length > 0) {
      email += "Bcc: " + emailData.bcc.join(',') + "\r\n";
    }
    
    email += "Subject: " + emailData.subject + "\r\n" +
             "Content-Type: multipart/mixed; boundary=" + boundary + "\r\n\r\n" +
             "--" + boundary + "\r\n" +
             "Content-Type: text/html; charset=UTF-8\r\n\r\n" +
             emailData.body + "\r\n\r\n";
    
    // Add each attachment
    emailData.attachments.forEach(attachment => {
      const attachmentName = attachment.getName();
      const contentType = attachment.getContentType() || "application/octet-stream";
      const base64Data = Utilities.base64Encode(attachment.getBytes());
      
      email += "--" + boundary + "\r\n" +
               "Content-Type: " + contentType + "\r\n" +
               "Content-Transfer-Encoding: base64\r\n" +
               "Content-Disposition: attachment; filename=\"" + attachmentName + "\"\r\n\r\n" +
               base64Data + "\r\n\r\n";
    });
    
    // Close the boundary
    email += "--" + boundary + "--";
  }
  
  // Encode the email as base64 for the Gmail API
  return Utilities.base64EncodeWebSafe(email);
}

