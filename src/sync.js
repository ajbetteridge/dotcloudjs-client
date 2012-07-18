/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>)
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
// ## dotcloud.sync
// *Sub-module providing the synchronized storage API.*  
// You can retrieve a collection using the sync.synchronize method.
// All collections retrieved this way are automatically synchronized across all the
// clients who access it. Changes are persisted (in mongoDB or redis) and propagated.
define(function(require) {

    // We use izs' `inherits` function to factor similar behavior between our 
    // array proxies. This is the non-ES5 version.
    function inherits(c, p, proto) {
        function F() { this.constructor = c; }
        F.prototype = p.prototype;
        var e = {};
        for (var i in c.prototype) {
            if (c.prototype.hasOwnProperty(i)) 
                e[i] = c.prototype[i];
        }
        if (proto) {
            for (i in proto) {
                if (proto.hasOwnProperty(i))
                    e[i] = proto[i];
            }
        }

        c.prototype = new F();

        for (i in e) {
            if (e.hasOwnProperty(i))
                c.prototype[i] = e[i];
        }
        c.super = p;
    }

    var merge = function(a, b) {
        for (var k in b) {
            if (!a[k]) {
                a[k] = b[k];
            } else if (typeof a[k] == 'object' && !(a[k] instanceof Array)) {
                a[k] = merge(a[k], b[k]);
            } else {
                a[k] = b[k];
            }
        }
        return a;
    };

    // This module is initialized by passing the config object which is a dependency 
    // of the *dotcloud* module.
    return function(config, io) {

        // `dotcloud.sync` object.
        var sync = {
            // `sync.synchronize(collection, [mode])`  
            // `collection` identifies a collection (well, duh) of objects.  
            // `mode` is the persistence layer used. Currently only supports mongo.
            synchronize : function(collection, mode, pvt) {
                if (pvt === undefined && (typeof mode == 'boolean')) {
                    pvt = mode, mode = undefined;
                }

                if (mode == 'mongo' || !mode) {
                    return new this.Array(collection, pvt);
                } else {
                    throw 'Unsupported persistence mode: ' + mode;
                }
                
            }
        };

        var AbstractArray = function(collection) {
            
            // Placeholder - this method is defined in child classes.
            this.__data;

            var that = this;

            // Update the length property.
            var updateLength = function() {
                that.length = that.__data().length;
            };

            var changeCallbacks = [updateLength];

            // This method is called everytime the underlying data is changed.
            // It is responsible of calling all the observers declared using the
            // `observe` method.
            this.__notifyChanged = function() {
                for (var i = changeCallbacks.length - 1; i >= 0; i--) {
                    changeCallbacks[i].apply(null, arguments);
                }
            };

            // `Array#observe(fn)`  
            // This method adds an observer function to the synchronized array. 
            // Whenever an insert, removal, or update occurs, the function is called
            // with parameters indicating the type and target of the change.
            this.observe = function(fn) {
                changeCallbacks.unshift(fn);
                return this;
            };

             // `Array#indexOf(obj)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf>
            this.indexOf = function(obj) {
                return this.__data().indexOf(obj);
            };

            // `Array#join(str)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/join>
            this.join = function(str) {
                return this.__data().join(str);
            };

            // `Array#lastIndexOf(obj)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf>
            this.lastIndexOf = function(obj) {
                return this.__data().lastIndexOf(obj);
            };

            // `Array#reverse()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reverse>
            // **Note: By design, the reverse operation is not reflected on the server-side**
            this.reverse = function() {
                this.__data().reverse();
                return this;
            };

            // `Array#slice(start, [end])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice>
            // **Note: the returned Array is a plain, non-synchronized Javascript array.**
            this.slice = function(start, end) {
                return this.__data().slice(start, end);
            };

            // `Array#sort([fn])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort>
            // **Note: By design, the sort operation is not reflected on the server-side**
            this.sort = function(fn) {
                this.__data().sort(fn);
                return this;
            };

            // `Array#toString()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString>
            this.toString = function() {
                return 'SynchronizedArray(' + this.__config().collection + '):[' + this.__data().join(', ') + ']';
            };

            // `Array#valueOf()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/valueOf>
            this.valueOf = function() {
                return this.__data().valueOf();
            };

            // Below are the ES5 iteration methods. The native method is not used
            // to avoid exposing the underlying data array directly.

            // `Array#filter(fn, [thisParameter])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/filter>
            this.filter = function(fn, that) {
                var data = this.__data();
                var result = [];
                for (var i = 0, l = this.length; i < l; i++) {
                    var val = data[i];
                    if (fn.call(that, val, i, this)) {
                        result.push(val);
                    }
                }
                return result;
            };

            // `Array#forEach(fn, [thisParameter])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/forEach>
            this.forEach = function(fn, that) {
                var data = this.__data();
                for (var i = 0, l = this.length; i < l; i++) {
                    var val = data[i];
                    fn.call(that, val, i, this);
                }
            };

            // `Array#every(fn, [thisParameter])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/every>
            this.every = function(fn, that) {
                var data = this.__data();
                for (var i = 0, l = this.length; i < l; i++) {
                    var val = data[i];
                    if (!fn.call(that, val, i, this)) {
                        return false;
                    }
                }
                return true;
            };

            // `Array#some(fn, [thisParameter])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/some>
            this.some = function(fn, that) {
                var data = this.__data();
                for (var i = 0, l = this.length; i < l; i++) {
                    var val = data[i];
                    if (fn.call(that, val, i, this)) {
                        return true;
                    }
                }
                return false;
            };

            this.reduce = function(fn, init) {
                var data = this.__data();
                var cur = (init !== undefined) ? init : data[0];
                for (var i = (init !== undefined) ? 0 : 1, l = this.length; i < l; i++) {
                    cur = fn(cur, data[i], i, this);
                }
                return cur;
            };

            this.reduceRight = function(fn, init) {
                var data = this.__data();
                var cur = (init !== undefined) ? init : data[data.length - 1];
                for (var i = this.length - ((init !== undefined) ? 1 : 2); i >= 0; i--) {
                    cur = fn(cur, data[i], i, this);
                }
                return cur;
            };
        };

    

        // ### sync.Array
        // Synchronized Array type, which is the return type of the `sync.synchronize` 
        // method. It wraps a javascript array and provides the same methods.  
        // **Note: Since the underlying persistence layer has no order preservation, 
        // order is discarded when using this structure. (push and unshift perform the 
        // same operation, as well as pop and shift). If order is important to your 
        // application, you should use the `RedisArray`.**
        sync.Array = function(collection, pvt) {
            var data = [];
            var dbid = config.dbid;
            var svcName = pvt ? 'sync-private' : 'sync';

            // Inherit the AbstractArray class
            inherits(sync.Array, AbstractArray);
            sync.Array.super.apply(this);

            var notifyChanged = this.__notifyChanged;

            this.__data = function() { return data; };
            this.__config = function() {
                return {
                    dbid: dbid,
                    collection: collection,
                    svcName: svcName
                };
            };

            // We call this RPC method once when creating the array to retrieve
            // the whole collection.
            io.call(this.__config().svcName, 'retrieve')(dbid, collection, function(error, result) {
                if (error)
                    throw JSON.stringify(error);
                switch (result.type) {
                    case 'synchronized':
                        data = result.data || [];
                        notifyChanged('synchronized', data);
                        break;
                    case 'inserted':
                        var obj = result.data;
                        var i, j;
                        if (obj instanceof Array) {
                            for (j = obj.length - 1; j >= 0; j--) {
                                for (i = data.length - 1; i >= 0; i--) {
                                    if (data[i]._id === obj[j]._id) {
                                        break;
                                    }
                                }
                                (i < 0) && data.push(obj[j]);
                            }
                        } else {
                            for (i = data.length - 1; i >= 0; i--) {
                                if (data[i]._id === obj._id) {
                                    return;
                                }
                            }
                            data.push(obj);
                        }
                        notifyChanged('inserted', obj);
                        break;
                    case 'removed':
                        var id = result.data;
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (data[i]._id === id) {
                                if (i === 0) { 
                                    data.shift();
                                } else if (i === data.length - 1) {
                                    data.pop();
                                } else {
                                    data.splice(i, 1);
                                }
                                notifyChanged('removed', id);
                                break;
                            }
                        }
                        break;
                    case 'removedall':
                        data = [];
                        notifyChanged('removedall', data);
                        break;
                    case 'updated':
                        var obj = result.data;
                        if (!obj)
                            return;
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (obj._id == data[i]._id) {
                                data[i] = obj;
                                notifyChanged('updated', obj);
                                break;
                            }
                        }
                        break;
                    default:
                        throw 'Unexpected change type: ' + result.type;
                }
            });

            // `Array#length` property.
            this.length = data.length;
        };

        // `Array#at(index, [update])`  
        // This method is not a standard Array method. It allows accessing the 
        // item present at the specified `index`.  
        // If the second parameter is provided, the objects will be merged and an
        // update command will be sent to the underlying persistence layer.
        sync.Array.prototype.at = function(index, update) {
            var data = this.__data(),
                cfg = this.__config();

            if (!!update) {
                data[index] = merge(data[index], update);
                io.call(cfg.svcName, 'update')(cfg.dbid, cfg.collection, data[index]._id, data[index], function(error, result) {
                    if (error) throw error;
                });
            }
            return data[index];
        };

        // `Array#pop()`  
        // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/pop>
        sync.Array.prototype.pop = function() {
            var data = this.__data(),
                cfg = this.__config();
            io.call(cfg.svcName, 'remove')(cfg.dbid, cfg.collection, data[data.length - 1]._id, 
                function(error, result) {
                    if (error) throw error;
                });

            return data[data.length - 1];
        };

        // `Array#push(objs...)`  
        // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push>
        sync.Array.prototype.push = function(obj) {
            var data = this.__data(),
                cfg = this.__config();

            if (arguments.length > 1) {
                var args = [];
                for (var i = arguments.length - 1; i >= 0; i--) {
                    args.unshift(arguments[i]);
                }
                obj = args;
            }

            io.call(cfg.svcName, 'add')(cfg.dbid, cfg.collection, obj, function(error, result) {
                if (error) throw error;
            });
            return data.length + arguments.length;
        };

        sync.Array.prototype.shift = function() {
            var data = this.__data(),
                cfg = this.__config();

            io.call(cfg.svcName, 'remove')(cfg.dbid, cfg.collection, data[0]._id, function(error, result) {
                if (error) throw error;
            });
            return data[0];
        };

        // `Array#splice(index, num, [objects...])`  
        // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/splice>
        // **Note: the returned Array is a plain, non-synchronized Javascript array.**
        sync.Array.prototype.splice = function(index, num) {
            var data = this.__data(),
                cfg = this.__config(),
                rmCb = function(error, result) {
                    if (error) throw error;
                };

            if (index < 0)
                index += data.length;

            for (var i = num - 1; i >= 0; i--) {
                io.call(cfg.svcName, 'remove')(cfg.dbid, cfg.collection, data[index + i]._id, rmCb);
            }
            
            for (i = arguments.length - 1; i >= 2; i--) {
                 this.push(arguments[i]);
            }
            return data.slice(index, index + num - 1);
        };

        // `Array#unshift(objs...)`  
        // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift>
        sync.Array.prototype.unshift = function(obj) {
            var cfg = this.__config();

            if (arguments.length > 1) {
                var args = [];
                for (var i = arguments.length - 1; i >= 0; i--) {
                    args.unshift(arguments[i]);
                }
                obj = args;
            }

            io.call(cfg.svcName, 'add')(cfg.dbid, cfg.collection, obj, function(error, result) {
                if (error) throw error;
            });
        };

        return sync;
    };
});
