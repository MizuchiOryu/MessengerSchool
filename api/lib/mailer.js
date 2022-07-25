const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_DSN,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_AUTH_USER,
    pass: process.env.MAILER_AUTH_PASSWORD
  }
});

exports.sendEmailEditAccount = async (user) => {

  let message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Modification de votre profil",
    html:`
          <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
          <p>Vous venez d'effectué des modifications par rapport a votre profil<p>
        `
  }

  transporter.sendMail(
    message,
    (err,info) => {
      if (err) {
        console.error(err)
      } else {
        console.log(info);
      }
    }
  )
}

exports.sendEmailVerifyAccount = async (user) => {

  let link = process.env.VITE_CLIENT_URL + "/verify/?token=" + user.recent_token;

  let message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Account Verify",
    html:`
          <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
          <p>Voici le lien pour activer votre compte<p>
          <a href=${link} >Activez mon compte </a>
        `
  }

  transporter.sendMail(
    message,
    (err,info) => {
      if (err) {
        console.error(err)
      } else {
        console.log(info);
      }
    }
  )
}

exports.sendEmailGetResetPassword = async (user) => {

  let link = process.env.VITE_CLIENT_URL + "/reset-password-confirm/?token=" + user.recent_token;
  message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Demande de changement de mot de passe",
    html:`
            <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
            <p>Vous avez fais une demande de changement mot de passe veuillez suivre ce lien<p>
            <a href=${link} >Activez mon compte </a>
        `
  }

  transporter.sendMail(
    message,
    (err,info) => {
      if (err) {
        console.error(err)
      } else {
        console.log(info);
      }
    }
  )
}

exports.sendEmailConfirmResetPassword = async (user) => {

  message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Confirmation de changement de mot de passe",
    html:`
            <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
            <p>La modification de votre mot de passe a bien etais effectué <p>
        `
  }

  transporter.sendMail(
    message,
    (err,info) => {
      if (err) {
        console.error(err)
      } else {
        console.log(info);
      }
    }
  )
}
