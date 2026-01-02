const supportService = require("../services/support.service");

async function create(req, res, next) {
  try {
    const id = await supportService.createRequest(
      req.user.id,
      req.body.message
    );
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const requests = await supportService.listRequests();
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

async function resolve(req, res, next) {
  try {
    await supportService.resolveRequest(req.params.id);
    res.json({ message: "Request resolved" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  resolve,
};
