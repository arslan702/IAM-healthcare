/**
 * This file exports a handler function for sending various types of emails.
 * It accepts a POST request with specific parameters (email, emailType, and username),
 * determines the type of email to be sent, and sends the appropriate email using the
 * specified template. Errors during the email sending process are handled, and appropriate
 * status codes and JSON responses are sent back to the client.
 */


/**
 * Handler function for sending various types of emails.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there's a problem sending the email.
 * @returns {Object} Returns a JSON response indicating success or failure.
 */
import sendMail from '../../services/email'; // Importing email sending service.
import {approveSalon } from '../../services/templates/approveSalon'; // Importing email template.  for approve
import {rejectSalon} from '../../services/templates/rejectSalon'


export default async function handler(req, res) {
  // Check if the request method is POST, return Method Not Allowed if not.
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Destructure required properties from the request body.
  const { email, emailType, username } = req.body;

  // Enum for different email types along with their corresponding functions.
  const emailEnum = {
    /**
     * Sends a welcome email to the salon seller.
     * @throws {Error} Throws an error if there's a problem sending the email.
     */
    approveSalon: async () => await sendMail({
      from: 'hello@kutsbee.com',
      to: email,
      subject: 'Welcome to Kutsbee!',
      text: `Welcome to Kutsbee!`,
      html: approveSalon({ username,email })
    }),
    rejectSalon: async () => await sendMail({
      from: 'hello@kutsbee.com',
      to: email,
      subject: 'Sorry to see you go',
      text: `Sorry to see you go`,
      html: rejectSalon({ username,email })
    })
  };

  // Check if the provided emailType is valid, return Bad Request if not.
  if (!emailEnum[emailType]) {
    return res.status(400).json({ error: 'Invalid emailType' });
  }

  try {
    // Call the appropriate email function based on the emailType provided.
    await emailEnum[emailType]();

    // Send a success response if the email is sent successfully.
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    // Handle any errors that occur during the email sending process.
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', success: false });
  }
}