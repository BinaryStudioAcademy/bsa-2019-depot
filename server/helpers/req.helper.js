const getReqUrl = req => `${req.protocol}://${req.get('host')}`;

module.exports = { getReqUrl };
