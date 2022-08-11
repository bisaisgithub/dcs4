import EmailCodeCDCS from '../../../../models/cdcs/EmailCodeCDCS';
import UsersCDCS from '../../../../models/cdcs/UsersCDCS';
import dbConnect from '../../../../utils/dbConnect';

const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})

export default async function registerHandler (req, res) {
  try {
    if (req.body.postType === 'verifyEmail') {
      await dbConnect();
      const code = Math.floor(1000 + Math.random() * 9000);
      const checkNameExist = await UsersCDCS.find({
        email: req.body.data.email,
          }, {name: 1}
        );
        if (checkNameExist.length > 0) {
          res.json({message: 'existEmail'})
        } else {
          const accessToken = await oAuth2Client.getAccessToken()
          const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
              type: 'OAuth2',
              user: process.env.EMAIL_USER,
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
              accessToken: accessToken
            }
          });
          const mailOptions = {
            from: `Calimlim Clinic System <${process.env.EMAIL_USER}>`,
            to: `${req.body.data.email}`,
            subject: 'Calimlim Registration Code',
            text: `Calimlim Registration code: ${code}`,
            html: `<h3>Calimlim Registration Code: ${code}</h3>`,
          };
          transport.sendMail(mailOptions, async (err)=>{
            if (err) {
              console.log('sending email error: ',err);
              res.json({message: 'sendingEmailError'})
            }else{
              const codeFind = await EmailCodeCDCS.findOne({email: req.body.data.email});
              if (codeFind) {
                const codeUpdate = await EmailCodeCDCS.updateOne({
                  email: req.body.data.email}, {code, generated_times: codeFind.generated_times + 1});
                  if (codeUpdate.modifiedCount) {
                    res.json({ message: 'emailSentCodeUpdated' });
                  }else{
                    res.json({ message: 'failedEmailCodeUpdated' });
                  }
              }else{
                const codeCreate = await EmailCodeCDCS.create({
                  email: req.body.data.email,
                  code, generated_times: 1
                });
                if (codeCreate) {
                  res.json({ message: 'emailSentCodeCreated' });
                } else {
                  res.json({ message: 'failedEmailCodeCreated' });
                }
              }
            }
          })
        }
    }else if (req.body.postType === 'verifyCode') {
      const codeFind = await EmailCodeCDCS.findOne({
        email: req.body.data.email,
        code: req.body.data.code
      });
      if (codeFind) {
        res.json({message: "codeOk" });
      } else {
        res.json({message: "codeInvalid" });
      }
    }
    else {
      
    }
    
  } catch (error) {
    console.log('register error: ', error);
    res.json({message: 'register catch error'})
  }
}