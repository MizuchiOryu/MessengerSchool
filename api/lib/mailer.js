const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "36e750334aecab",
    pass: "2d6276d0cb577f"
  }
});

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

exports.sendEmailCreateAccount = async (user,randomPassword) => {

  let link = process.env.VITE_CLIENT_URL + "/verify/?token=" + user.recent_token;

  let message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Account Created by Administrator",
    html:`
          <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
          <p>Voici le lien pour activer votre compte ainsi que ton mot de passe celui ci peut etre reinitialiser apres la confirmation de ton compte<p>
          <p>${randomPassword}<p>
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


exports.sendEmailBannedAccount = async (user) => {


  let message = {
    from: process.env.MAILER_FROM_ADDRESS,
    to: user?.email,
    subject: "Account is Banned",
    html:`
          <h1>Bonjour ${user.lastName} ${user.firstName},</h1>
          <p>Votre vien d'etre banni par un administrateur vous ne pouvais plus acceder a nos outils<p>
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