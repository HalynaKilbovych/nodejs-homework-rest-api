const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const {User} = require('../models/user'); 
const {HttpError, ctrlWrapper, sendEmail} = require('../utils');
const {SECRET_KEY, BASE_URL} = process.env; 

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async(req, res) => { 
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user) { 
        throw HttpError(409, `Email ${user.email} already in use`)
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email); 
    const verificationToken = uuidv4(); 

    const newUser = await User.create({...req.body, password: hashPassword, avatarUrl, verificationToken});
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href='${BASE_URL}/api/auth/verify/${verificationToken}'>Click verify email</a>`,
      };
    
      await sendEmail(verifyEmail)

    res.status(201).json({
        email: newUser.email,
        password: newUser.password,
    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, 'User not found');
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: '',
    });
  
    res.json({
      message: 'Verification successful',
    });
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, 'Email not found');
    }
    if (user.verify) {
      throw HttpError(400, 'Verification has already been passed');
    }
  
    const verifyEmail = {
      to: email,
      subject: 'Verify Email',
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
    };
  
    await sendEmail(verifyEmail);
  
    res.json({
      message: 'Verification email sent',
    });
};

const login = async(req, res) => { 
    const {email, password} = req.body; 
    const user = await User.findOne({email}); 
    if(!user) { 
        throw HttpError(401, 'Email or password is wrong')
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password); 
    if(!passwordCompare) { 
        throw HttpError(401, 'Email or password is wrong')
    }
    const payload = { 
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '10d'});

    res.json({token})
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
  
    res.json({
      message: 'Logout success',
    });
};

  const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250);
    await image.writeAsync(tempUpload);

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarsUrl = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarsUrl });
  
    res.json({ 
        avatarsUrl,
    });
};

module.exports = { 
    register: ctrlWrapper(register), 
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail), 
    getCurrent, 
    

}
require('dotenv').config(); 
