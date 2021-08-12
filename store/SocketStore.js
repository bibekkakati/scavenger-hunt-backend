const SocketStore = (function () {
	var _data = {};

	function add(id, connection) {
		_data[id] = connection;
		return true;
	}

	function get(id) {
		return _data[id] || false;
	}

	function remove(id) {
		if (_data.hasOwnProperty(id)) {
			delete _data[id];
		}
		return true;
	}

	return {
		add,
		get,
		remove,
	};
})();

module.exports = SocketStore;
