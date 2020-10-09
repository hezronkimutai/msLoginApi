const responseHandler = (resObj, res) => res.status(resObj.status || 204).send(resObj);
export { responseHandler };
