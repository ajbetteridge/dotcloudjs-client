define(function(require) {
    return function(config, io) {
        return {
            register: function(user, password, password2, cb) {
                if (password !== password2)
                    return cb({ error: 'Passwords do not match.' });
                io.call('auth', 'register')(user, password, cb);
            },
            login: function(user, password, cb) {
                io.call('_stackio', 'login')(user, password, cb);
            },
            logout: function(cb) {
                io.call('auth', 'logout')(cb);
            },
            checkAvailable: function(user, cb) {
                io.call('auth', 'hasUser')(user, function(err, hasUser) {
                    return cb(err, !hasUser);
                });
            }
        }
    }
});