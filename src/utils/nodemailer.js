import nodemailer from "nodemailer";
import ejs from "ejs";
import ResponseError from "../error/response-error.js";

const { GOOGLE_HOST, GOOGLE_PORT, GOOGLE_PASS, GOOGLE_USER } = process.env;

class Nodemailer {
  // Fungsi untuk mengirim email menggunakan Nodemailer
  static sendMail = async (to, subject, html) => {
    try {
      const transport = nodemailer.createTransport({
        host: GOOGLE_HOST,
        port: GOOGLE_PORT,
        secure: true,
        auth: {
          user: GOOGLE_USER,
          pass: GOOGLE_PASS,
        },
      });

      await transport.sendMail({
        from: `Smart Internship  <${GOOGLE_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      // Tangani kesalahan dan lemparkan objek error ResponseError
      throw new ResponseError(400, error.message);
    }
  };

  // Fungsi untuk mendapatkan konten HTML dari file menggunakan EJS
  static getHtml = (fileName, data) => {
    return new Promise((resolve, reject) => {
      const path = `${process.cwd()}/src/views/${fileName}`;

      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  };
}

export default Nodemailer;
