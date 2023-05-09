const bcrypt = require('bcryptjs');
const path = require('path');
const Uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_TTL, STATIC_PATH } = require('../config/index');
const User = require('../models/user');
const { NotFound, Conflict, Unautorized } = require('../errors/index');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFound('Нет пользователей в базе');
    })
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
  .orFail(() => {
    throw new NotFound('Такого пользователя нет в базе');
  })
  .then((user) => {
    const { _id } = user;
    const token = jwt.sign(
      { _id },
      JWT_SECRET,
      { expiresIn: JWT_TTL },
    );
    res.send({user, token});
  })
  .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
  .orFail(() => {
    throw new NotFound('Такого пользователя нет в базе');
  })
  .then((user) => {
    res.status(200).send(user);
  })
  .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unautorized('Неправильные логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            return user;
          }
          throw new Unautorized('Неправильные логин или пароль');
        });
    })
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        JWT_SECRET,
        { expiresIn: JWT_TTL },
      );
      res.send({user, token});
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, username } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Данный email уже используется');
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, username }))
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        JWT_SECRET,
        { expiresIn: JWT_TTL },
      );
      res.send({ token, user, message: `Пользователь создан` });
      })
    .catch(next);
};

module.exports.uploadAvatar = (req, res, next) => {
    const file = req.files.file;
   User.findById(req.user._id)
   .then(async (user) => {
      const avatarName = Uuid.v4() + ".jpg"
      file.mv(path.resolve(`${STATIC_PATH}/${avatarName}`));
      user.avatar = avatarName;
      await user.save();
      res.status(200).send({ user, message: `Аватар изменен` });
   })
  .catch(next);
}

module.exports.uploadInfo = (req, res, next) => {

  const { age, university } = req.body;

  User.findByIdAndUpdate(req.user._id, { age, university }, { new: true })
  .orFail(() => {
    throw new NotFound('Такого пользователя нет в базе');
  })
  .then((user) => {
    res.status(200).send({ user, message: `Данные изменены` });
  })
  .catch(next);
};

module.exports.addFriend = (req, res, next) => User.findById(req.user._id, (err, data) => {
  if (err) {
    new NotFound('Нет пользователя с таким id')
  }
  else {
    const { friends } = data;
    const methodToUse = friends.includes(req.params.id) ? '$pull' : '$addToSet';
    User.findByIdAndUpdate(
      req.user._id,
      { [methodToUse]: { friends: req.params.id } },
      { new: true },
    )
      .orFail(new NotFound('Нет пользователя с таким id'))
      .then(() => {
        User.findByIdAndUpdate(
          req.params.id,
          { [methodToUse]: { friends: req.user._id } },
          { new: true },
        ).then((user) => console.log(user));
      })
      .then(() => {
        User.find({})
        .then((users) => res.status(200).send(users))
      })
      .catch(next);
  }
})

module.exports.getUserFriends = (req, res, next) => {

  User.findById(req.user._id)
  .orFail(() => {
    throw new NotFound('Такого пользователя нет в базе');
  })
  .then((friends) => {
    res.status(200).send(friends);
  })
  .catch(next);
};

module.exports.deleteUserById = (req, res, next) => User.findByIdAndDelete({_id: req.params.id})
.orFail(new NotFound('Пользователь не найден'))
.then((user) => {
  res.status(200).send(user);
})
.catch((next));

