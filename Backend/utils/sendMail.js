import { transporter } from "../config/nodemailer.js"


export const sendMail=async(to,subject,html)=>{
   try {await transporter.sendMail({

        from: `"Student App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    })
    return true;}
    catch(err){
       console.error(`Failed to send email to ${to}:`, err);
       throw new Error('Failed to send email');
        
    }
};