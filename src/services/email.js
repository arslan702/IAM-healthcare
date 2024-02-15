import nodemailer from 'nodemailer';

/**
 * Sends an email using the Nodemailer library.
 *
 * @param {Object} params - An object containing email parameters.
 * @param {string} params.from - The sender's email address.
 * @param {string} params.to - The recipient's email address.
 * @param {string} params.subject - The email subject.
 * @param {string} params.text - The email text content.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws {Error} Throws an error if sending the email fails.
 */
async function sendMail({ from, to, subject, text,html }) {
   try {
      // Create a Nodemailer transporter configuration.
      let transporter = nodemailer.createTransport({
         // host: 'smtp.gmail.com',
         host: 'smtp.titan.email',
         // port: 456,
         port: 465,
         // service: 'gmail',
         auth: {
            // user: 'arslanra761@gmail.com',
            user: 'hello@kutsbee.com',
            // pass: 'tlxeymkfphowjqvr',
            pass: '!!kutsb332023!!'
         },
      });
      // 'kxmmteibipuzyinv',
      // Send the email using the configured transporter.
      await transporter.sendMail({
         from: `Kutsbee <${from}>`,
         to,
         subject,
         text,
         html
      });
   } catch (error) {
      // Log and re-throw any errors that occur during the email sending process.
      console.log(error);
      throw new Error(error);
   }
}

export default sendMail