export const cardData = [
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
        <title>Document</title>
        <style>
            /* Common Styles */
            
            .container {
                width: 270px;
                height: 550px;
                max-width: 550px;
                margin: 20px auto;
                background-color: #fff;
                
                padding: 20px;
                border-radius: 10px;
                overflow: hidden; /* Ensure content doesn't overflow */

                width: 350px; height: 550px;  margin: 20px; align-self: center; border-radius: 20px; overflow: hidden; background-color: #fff; color: #000;
            }
    
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            .header img {
                max-width: 150px; /* Ensure the logo doesn't overflow */
                height: 150px; /* Maintain aspect ratio */
            }
    
            hr {
                margin: 20px 0;
                border: none;
                border-top: 2px solid red;
            }
    
            .contact-info {
                background-color: #414143;
                padding: 20px;
                color: #fff;
                border-radius: 10px;
                margin-top: 20px;
            }
    
            .contact-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
    
            .contact-item i {
                margin-right: 10px;
                font-size: 24px;
                color: red;
            }
    
            .contact-item h5 {
                margin: 0;
                font-size: 16px;
            }
    
            /* Responsive Styles */
            @media only screen and (max-width: 550px) {
                .container {
                    padding: 10px;
                }
    
                .contact-info {
                    padding: 15px;
                }
    
                .contact-item i {
                    font-size: 20px;
                }
    
                .contact-item h5 {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body style="display: flex; justify-content: center; align-items: center; height: 99vh; margin: 0;">
        <div class="container">
            <div class="header">
                <img src="https://cdn.brandingprofitable.com/upload/65f1927ae0263B_Profitable_Logo.d992ead43b01d11544cd%20(1).png" alt="slogan">
            </div> 
            <hr>
            <div class="contact-info">
                <h1>MICHAL JOHNS</h1>
                <h5>Solution Manager</h5>
    
                <div class="contact-item">
                    <i class="fa-solid fa-phone"></i>
                    <h5>000 1234 5678</h5>
                </div>
    
                <div class="contact-item">
                    <i class="fa-solid fa-phone"></i>
                    <a href="www.website.com" style="color: #fff;">www.website.com</a>
                </div>
    
                <div class="contact-item">
                    <i class="fa-solid fa-phone"></i>
                    <h5>Street Location</h5>
                </div>
            </div>
        </div>
    </body>
    </html>`,

    // 2

    `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
                <title>Document</title>
                </head>
                <body style=" display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                    <div style="background-image: url('https://img.freepik.com/free-vector/simple-blue-gradient-background-vector-business_53876-166894.jpg?size=626&ext=jpg&ga=GA1.1.735520172.1710288000&semt=ais'); width: 350px; height: 550px;  margin: 20px; align-self: center; border-radius: 20px; overflow: hidden; background-color: #fff; color: #000;">
                        <div style="height: 35%; display: flex; justify-content: flex-start; align-items: flex-end; background-size: cover; background-position: center; padding-left: 20px; ">
                            <img src="https://cdn.brandingprofitable.com/upload/65f1927ae0263B_Profitable_Logo.d992ead43b01d11544cd%20(1).png" alt="slogan" style="height: 100px; width: 100px;">
                        </div>
                        <div style="height: 55%; padding: 4%; display: flex; flex-direction: column; justify-content: space-around; text-align: left;">
                            <h1 style="margin: 0;color: #3B799C;">MICHAL JOHNS</h1>
                            <h4 style="margin: 0; color: #333;">Solution Manager</h4>
                            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; justify-content: flex-end;">
                                 <div style="color: #333;">
                                    <h4 style="margin: 0;">000 1234 5678</h4>
                                </div>
                                <div style="height: 60px; width: 60px; background-color: #729FBD; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-phone" style="font-size: 24px; color: #fff;"></i>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                               <div style="color: #333; text-align: right;">
                                    <a href="www.website.com" style="margin: 0;">www.website.com</a>
                                </div>
                                <div style="height: 60px; width: 60px; background-color: #5180A2; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-globe" style="font-size: 24px; color: #fff;"></i>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-end;">
                                <div style="color: #333;">
                                    <h4 style="margin: 0;">Street Location</h4>
                                </div>
                                <div style="height: 60px; width: 60px; background-color: #3B799C; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-map-marker-alt" style="font-size: 24px; color: #fff;"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`,

                
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
    <title>Document</title>
    </head>
    <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
         <div style="background-image: url('https://img.freepik.com/free-vector/blue-yellow-watercolor-patterned-mobile-phone-wallpaper-template_53876-97597.jpg?size=626&ext=jpg&ga=GA1.1.899946409.1710332052&semt=ais'); background-repeat: no-repeat; width: 350px; height: 600px; margin: 20px; align-self: center; border-radius: 20px; overflow: hidden; background-color: #fff; color: #000; background-size:350px 600px">
            <div style="height: 35%; display: flex; justify-content: flex-end; margin-right:20px; align-items: center; background-size: cover; background-position: center;  ">
                <img src="https://cdn.brandingprofitable.com/upload/65f1927ae0263B_Profitable_Logo.d992ead43b01d11544cd%20(1).png" alt="slogan" style="height: 100px; width: 100px;">
            </div>
            <div style="height: 55%; padding: 4%; display: flex; flex-direction: column; justify-content: space-around; text-align: left; margin-top:-50px">
                 <hr style="margin: 10px 0;
                    border: none;
                    border-top: 2px solid #D7B877;"/>
                <h1 style="margin: 0; color: #192936; text-align: center; padding: 10px; border-radius: 5px;">MICHAL JOHNS</h1>
                <h3 style="margin: 0; color: #192936; text-align: center;">Solution Manager</h3>
                 <hr style="margin: 10px 0;
                    border: none;
                    border-top: 2px solid #D7B877;"/>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 20px; justify-content: flex-start;">
                     <div style="height: 60px; width: 60px; background-color: #192936; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-phone" style="font-size: 24px; color: #D7B877;"></i>
                    </div>
                     <div style="color: #192936; text-align: left;">
                        <h4 style="margin: 0;">000 1234 5678</h4>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: flex-start; gap: 10px; margin-top:10px">
                    <div style="height: 60px; width: 60px; background-color: #192936; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-globe" style="font-size: 24px; color: #D7B877;"></i>
                    </div>
                      <div style="color: #192936; text-align: left;">
                        <a href="www.website.com" style="margin: 0;">www.website.com</a>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-start;  margin-top:10px">
                    <div style="height: 60px; width: 60px; background-color: #192936; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                        <i class="fas fa-map-marker-alt" style="font-size: 24px; color: #D7B877;"></i>
                    </div>
                      <div style="color: #192936; text-align: left;">
                        <h4 style="margin: 0;">Street Location</h4>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`,

    // 3

    `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
                    <title>Document</title>
                    <style>
                        /* Common Styles */
                
                        .container {
                            width: 270px;
                            height: 550px;
                            max-width: 550px;
                            margin: 20px auto;
                            background-color: #fff;
                            
                            padding: 20px;
                            border-radius: 10px;
                            overflow: hidden; /* Ensure content doesn't overflow */
            
                            width: 350px; height: 550px;  margin: 20px; align-self: center; border-radius: 20px; overflow: hidden; background-color: #fff; color: #000;
                        }
                
                        .header {
                            text-align: center;
                            padding: 20px 0;
                        }
                
                        .header img {
                            height: 150px;
                            width: 150px;
                            border-radius: 50%;
                        }
                
                        hr {
                            width: 100%;
                            height: 10px;
                            background-color: #007BFF;
                            margin: 0;
                            border: none;
                        }
                
                        .contact-info {
                            height: calc(100% - 200px);
                            padding: 4%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            color: #000;
                        }
                
                        .contact-item {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                
                        .icon-container {
                            height: 60px;
                            width: 60px;
                            background-color: #007BFF;
                            border-radius: 50%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                
                        .contact-item i {
                            font-size: 24px;
                            color: #fff;
                        }
                
                        .contact-details {
                            text-align: center;
                        }
                
                        /* Responsive Styles */
                        @media only screen and (max-width: 320px) {
                            .container {
                                width: 100%;
                            }
                        }
                    </style>
                </head>
                <body style=" display: flex; justify-content: center; align-items: center; height: 99vh; margin: 0;">
                    <div class="container">
                        <div class="header">
                            <img src="https://cdn.brandingprofitable.com/upload/65f1927ae0263B_Profitable_Logo.d992ead43b01d11544cd%20(1).png" alt="slogan">
                        </div>
                        <hr>
                        <div class="contact-info">
                            <h1 style="margin: 0; text-align: center;">MICHAL JOHNS</h1>
                            <h5 style="margin: 0; text-align: center;">Solution Manager</h5>
                            <div class="contact-item">
                                <div class="icon-container">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="contact-details">
                                    <h5 style="margin-bottom: 5px;">000 1234 5678</h5>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="icon-container">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <div class="contact-details">
                                    <a href="www.website.com" style="margin-bottom: 5px;">www.website.com</a>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="icon-container">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div class="contact-details">
                                    <h5 style="margin-bottom: 5px;">Street Location</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                `,

    `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
                <title>Document</title>
                </head>
                <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                     <div style="background-image: url('https://img.freepik.com/free-vector/neon-gradient-curve-frame-template-vector_53876-165853.jpg?w=360&t=st=1710394526~exp=1710395126~hmac=cc5c339fbaacc9a6f0214ac45acdb2031466bf179ac1df25284b21263458c987'); background-repeat: no-repeat; width: 350px; height: 550px; margin: 20px; align-self: center; border-radius: 20px; overflow: hidden; background-color: #fff; color: #000; background-size:350px 550px">
                        <div style="height: 35%; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center;  ">
                            <img src="https://cdn.brandingprofitable.com/upload/65f1927ae0263B_Profitable_Logo.d992ead43b01d11544cd%20(1).png" alt="slogan" style="height: 100px; width: 100px;">
                        </div>
                        <div style="height: 55%; padding: 4%; display: flex; flex-direction: column; justify-content: space-around; text-align: left; margin-top:-50px">
                            <h1 style="margin: 0; color: #FFC0CB; text-align: center; padding: 10px; border-radius: 5px;">MICHAL JOHNS</h1>
                            <h4 style="margin: 0; color: #fff; text-align: center;">Solution Manager</h4>
                            <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; justify-content: flex-start;">
                                 <div style="height: 60px; width: 60px; background-color: #FFC0CB; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-phone" style="font-size: 24px; color: #230038;"></i>
                                </div>
                                 <div style="color: #fff; text-align: left;">
                                    <h4 style="margin: 0;">000 1234 5678</h4>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: flex-start; gap: 10px;">
                                <div style="height: 60px; width: 60px; background-color: #FFC0CB; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-globe" style="font-size: 24px; color: #230038;"></i>
                                </div>
                                  <div style="color: #fff; text-align: left;">
                                    <a href="www.website.com" style="margin: 0;">www.website.com</a>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-start;">
                                <div style="height: 60px; width: 60px; background-color: #FFC0CB; border-radius: 50px; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-map-marker-alt" style="font-size: 24px; color: #230038;"></i>
                                </div>
                                  <div style="color: #fff; text-align: left;">
                                    <h4 style="margin: 0;">Street Location</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`,

]