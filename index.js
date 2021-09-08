const { EventEmitter } = require('events');
const util = require('util');

const DEFAULT_HASH = process.env.FLUTTERWAVE_SECRET_HASH;
const DEFAULT_OPTIONS = {
  useEventKey: true,
  defaultEventKey: 'FLW_EVENT'
};

function FlutterwaveEvents(hash = DEFAULT_HASH, options = DEFAULT_OPTIONS) {
  if (!hash) throw new Error('You must supply your `Flutterwave` secret hash!');

  this._hash = hash;
  this._options = options;

  if (!(this instanceof FlutterwaveEvents)) {
    return new FlutterwaveEvents(key);
  }
}

FlutterwaveEvents.prototype.webhook = function () {
  const self = this;
  return function (req, res, next) {
    const flutterwaveHeader = req.headers['verif-hash'];
    // If the header is empty or request body is empty, then it is not a valid webhook
    if (!flutterwaveHeader || !Object.keys(req.body).length) {
      return res.sendStatus(400);
    }
    if (flutterwaveHeader === self._hash) {
      const eventKey = self._options.useEventKey ? req.body.event : self._options.defaultEventKey;
      self.emit(eventKey, req.body);
      return res.sendStatus(200);
    }
    return res.sendStatus(400);
  };
};

util.inherits(FlutterwaveEvents, EventEmitter);

module.exports = FlutterwaveEvents;
