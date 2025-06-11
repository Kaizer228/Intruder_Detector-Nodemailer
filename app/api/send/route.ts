 
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { image, email, password } = await req.json();

    if (!image || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: email,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: email,
      to: email,
      subject: 'Neurowatch AI Captured A Person',
      text: 'Neurowatch AI Captured A Person',
      attachments: [
        {
          filename: 'captured_image.jpg',
          content: image.split(',')[1],  
          encoding: 'base64',
          contentType: 'image/jpeg',
        },
      ],
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email.' }, { status: 500 });
  }
}
