import jsonpatch from 'json-patch';


exports.validatePayload = (req, res, next) => {
	const { data, patch } = req.body;

	if(!data || !patch) {
		return res.status(400).json({
			message: 'Incomplete params'
		});
	}

	if( typeof data !== 'object' || typeof patch !== 'object') {
		return res.status(400).json({
			message: 'Invalid params'
		});
	}

	return next();
}

exports.patch = (req, res) => {
	const { data: payload, patch } = req.body;
	try {
		const data = jsonpatch.apply(payload, patch);
		return res.status(200).json({
			message: 'Patched data successfully',
			data
		})
	} catch (error) {
		return res.status(400).json({
			message: error.message,
			error
		})
	}

};
