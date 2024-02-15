const approveSalon = ({ username, email }) => {
  return `

  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title></title>
  </head>
  
  <body style="margin: 0; padding: 0; background-color: #fff; font-family: Arial, sans-serif;">
      <div style="background-color: #FEF1EC; max-width: 600px; margin: 0 auto; padding-bottom: 30px; border-radius: 5px;">
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
              <img style="width: 180px; margin: 0 auto;" src="https://i.ibb.co/H4DwgCC/17e8246cd74c70eafcb705b77084c9c1-1.png"
                  alt="lglg" />
          </div>
          <div style="background-color: #F26D5C; height: 77px; display: flex; align-items: center; justify-content: center;">
              <p style="color: white; text-align: center; font-size: 32px; font-family: mart; margin: auto;">Welcome to Kutsbee!</p>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
              <img style="width: 100%; margin: 0;" src="https://i.ibb.co/SfQ3zMF/Whats-App-Image-2023-11-15-at-6-31-44-PM.jpg"
                  alt="logo" />
          </div>
          <h1 style="text-align: center;">Dear ${username?.charAt(0)?.toUpperCase() + username?.slice(1)}!</h1>
          <h4 style="text-align: center; margin-left: 50px; margin-right: 50px;">We are excited to have you onboard. Your account at Kutsbee is ready to use. We hope you enjoy the experience
          <br/>
          </h4>
          <div style="text-align: center; margin-top: 10px;">
              <a href="https://business.kutsbee.com/signin"
                  style="background-color: #F26D5C; color: white; border-radius: 5px; border: none; padding: 10px 20px; text-decoration: none; font-size: 24px;">Login</a>
          </div>
          <div style="text-align: center; margin-top: 10px;">
          If  you  have  any  questions  or  concerns,  please  contact  us  immediately  at <b>support@kutsbee.com</b>
          </div>
          <div style="text-align: center; color: #F26D5C; margin-top: 30px;">
              Thank you
          </div>
          <div style="text-align: center; color: #F26D5C; margin-top: 10px;">
              Kutsbee
          </div>
      </div>
  </body>
  
  </html>

    `;
};

export { approveSalon };
