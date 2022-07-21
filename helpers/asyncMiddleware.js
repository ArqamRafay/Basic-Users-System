const asyncUtil = fn =>
(req, res, next) =>
  fn(req, res, next)
    .catch(
      err => {
        console.log(err);
        return res.status(200).send(err);
      }
    );

module.exports = asyncUtil
