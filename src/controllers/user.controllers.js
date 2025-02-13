const catchError = require("../utils/catchError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const EmailCode = require("../models/EmailCode");
const jwt = require("jsonwebtoken");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const { email, password, firstName, lastName, country, image, frontBaseUrl } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    country,
    image,
  });
  const code = require("crypto").randomBytes(32).toString("hex");

  await EmailCode.create({
    code,
    userId: result.id,
  });

  await sendEmail({
    to: email,
    subject: "Verificate email for user app",
    html: `
    <h1>Hello ${firstName} ${lastName}</h1>
    <p>Thanks for sign up in user app</p>
    <p>Verify: ${frontBaseUrl}/${code}</p>
    `,
  });

  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, country, image } = req.body;
  const result = await User.update(
    { email, firstName, lastName, country, image },
    {
      where: { id },
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const verifyCode = catchError(async (req, res) => {
  const { code } = req.params;
  const emailCode = await EmailCode.findOne({ where: { code } });
  if (!emailCode) return res.status(401).json({ message: "Invalid code" });
  /*   const user = await User.findByPk(emailCode.userId);
  user.isVerified = true;
  await user.save(); */
  const user = await User.update(
    { isVerified: true },
    { where: { id: emailCode.userId }, returning: true }
  );
  await emailCode.destroy();

  return res.json(user);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "invalid credentials user" });

  if (!user.isVerified)
    return res.status(401).json({ message: "user is not verified" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ message: "invalid credentials password" });

  const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ user, token });
});

const getLoggedUser = catchError(async (req, res) => {
  return res.json(req.user);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  verifyCode,
  login,
  getLoggedUser,
};
