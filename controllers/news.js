const News = require('../models/news');
const Uuid = require('uuid');
const { NotFound } = require('../errors/index');
const { STATIC_PATH } = require('../config/index');
const path = require('path');

const getNews = (req, res, next) => {
  News.find({})
    .then((news) => {
      if (!news.length) {
        throw new NotFound('Посты не найдены');
      }
      res.status(200).send(news)})
    .catch(next);
};

const getNewsByOwner = (req, res, next) => {
  News.find({owner: req.params.id})
    .then((news) => {
      if (!news.length) {
        throw new NotFound('Посты не найдены');
      }
      res.status(200).send(news)})
    .catch(next);
};

const postNews = (req, res, next) => {
  let image = '';
  if (Object.prototype.hasOwnProperty.call(req, 'files')) {
    const file = req.files.file;
    image = Uuid.v4() + ".jpg";
    file.mv(path.resolve(`${STATIC_PATH}/${image}`));
  }

  const { description, owner } = req.params;
  News.create({ description, owner, image})
    .then((news) => {
      if (!news) {
        throw new NotFound('Посты не найдены');
      }
      res.status(200).send(news);
    })
    .catch(next);
};

const deleteNews = (req, res, next) => News.deleteMany({})
.orFail(new NotFound('Новости не найдены'))
.then(() => res.status(200).send({ message: 'Новости удалены!' })
)
.catch((next));

const deleteNewsById = (req, res, next) => News.findByIdAndDelete({_id: req.params.id})
.orFail(new NotFound('Новость не найдена'))
.then(() => {
  News.find({owner: req.user._id})
    .then((news) => {
      if (!news.length) {
        res.status(200).send([]);
      }
      res.status(200).send(news)})
})
.catch((next));

const likePost = (req, res, next) => News.findById(req.params.id, (err, data) => {
  if (err) {
    new NotFound('Нет карточки с таким id')
  }
  else {
    const { likes } = data;
    const methodToUse = likes.includes(req.user._id) ? '$pull' : '$addToSet';
    News.findByIdAndUpdate(
      req.params.id,
      { [methodToUse]: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new NotFound('Нет карточки с таким id'))
      .then((post) => {
        res.status(200).send(post);
      })
      .catch(next);
  }
})

module.exports = { getNews, postNews, deleteNews, getNewsByOwner, deleteNewsById, likePost };