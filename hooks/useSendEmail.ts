
'use server'; 

import nodemailer from 'nodemailer';
 

export default async function useSendEmail(image : any, email : string , password : string) {
  
   
 

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: email,  
      subject: `Neurowatch AI Captured A Person`,
      text :  "Neurowatch AI Captured A Person",
      attachments: [
            {
              
              filename: `captured_image.jpg`, 
              content:  image.split(",")[1],  
              encoding: "base64", 
              contentType: "image/jpeg",
            },
          ],
    });
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email.' };
  }
}
