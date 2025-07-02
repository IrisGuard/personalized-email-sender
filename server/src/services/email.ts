import nodemailer from 'nodemailer';
import { config } from '../config/environment';

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmail.user,
      pass: config.gmail.appPassword
    }
  });
}