/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>)
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
    Sub-module providing the synchronized storage API. 

    @description
    You can retrieve a collection using the sync.synchronize method.
    All collections retrieved this way are automatically synchronized across all the
    clients who access it. Changes are persisted (in mongoDB or redis) and propagated.

    
    @name dotcloud.sync
    @namespace
*/
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

            /**
                Synchronize a collection.

                @description
                Acts like almost like a regular array to keep it simple and fun to use.
                
                @public
                @name dotcloud.sync#synchronize
                @function
                @param {String} collection Identifies a collection (well, duh) of objects.
                @param {String} [mode=mongo] Is the persistence layer used. Currently supports mongo, redis.

                @example
// Start synchronizing the "people" collection
var people = dotcloud.sync.synchronize('people');

            */
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

        /**
            @name dotcloud.sync.AbstractArray
            @lends dotcloud.sync
        */
        var AbstractArray = function(collection) {
            
            // Placeholder - this method is defined in child classes.
            this.__data;

            var that = this;

            // Update the length property.
            var updateLength = function() {
                that.length = that.__data().length;
            };

            var changeCallbacks = [updateLength];

            /**
                This method is called everytime the underlying data is changed.
                
                @description
                It is responsible of calling all the observers declared using the
                `observe` method.

                @function
                @protected
                @name dotcloud.sync.AbstractArray#__notifyChanged
        
            */
            this.__notifyChanged = function() {
                for (var i = changeCallbacks.length - 1; i >= 0; i--) {
                    changeCallbacks[i].apply(null, arguments);
                }
            };

            /**
                This method adds an observer function to the synchronized array.

                @description
                Whenever an insert, removal, or update occurs, the function is called
                with parameters indicating the type and target of the change.

                @public
                @memberOf dotcloud.sync.AbstractArray
                @name dotcloud.sync.AbstractArray#observe
                @param {Function} fn Callback function called when the array is modified.
            */
            this.observe = function(fn) {
                changeCallbacks.unshift(fn);
                return this;
            };

             /**
                indexOf.

                @public
                @function
                @name dotcloud.sync.AbstractArray#indexOf 
                @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf">MDN > indexOf</a>
            */
            this.indexOf = function(obj) {
                return this.__data().indexOf(obj);
            };

            /** 
                join.

                @description

                @public
                @function
                @name dotcloud.sync.AbstractArray#join
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/join">MDN > join</a>            */
            this.join = function(str) {
                return this.__data().join(str);
            };

            /** 
                lastIndexOf.

                @description

                @public
                @name dotcloud.sync.AbstractArray#lastIndeOf
                @function
                @param {Object} obj
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf">MDN > lastIndexOf</a>            */
            this.lastIndexOf = function(obj) {
                return this.__data().lastIndexOf(obj);
            };

            /** 
                reverse.

                @description
                By design, the reverse operation is not reflected on the server-side

                @public
                @name dotcloud.sync.AbstractArray#reverse
                @function
                @param {Object} obj
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf">MDN > lastIndexOf</a>            */
            this.reverse = function() {
                this.__data().reverse();
                return this;
            };

            /** 
                slice.

                @description
                The returned Array is a plain, non-synchronized Javascript array.

                @public
                @name dotcloud.sync.AbstractArray#slice
                @function
                @param {Object} start
                @param {Object} [end]
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice">MDN > slice</a>            */
            this.slice = function(start, end) {
                return this.__data().slice(start, end);
            };

            /** 
                sort.

                @description
                By design, the sort operation is not reflected on the server-side.

                @public
                @name dotcloud.sync.AbstractArray#sort
                @function
                @param {Function} fn
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort">MDN > sort</a>            */
            this.sort = function(fn) {
                this.__data().sort(fn);
                return this;
            };

            // `Array#toString()`  
            // <>
            /** 
                toString.

                @description

                @public
                @name dotcloud.sync.AbstractArray#toString
                @function
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString">MDN > toString</a>            */
            this.toString = function() {
                return 'SynchronizedArray(' + this.__config().collection + '):[' + this.__data().join(', ') + ']';
            };

            /** 
                valueOf.

                @description

                @public
                @name dotcloud.sync.AbstractArray#valueOf
                @function
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/valueOf">MDN > valueOf</a>            */
            this.valueOf = function() {
                return this.__data().valueOf();
            };

            /** 
                filter.

                @description
                Below are the ES5 iteration methods. The native method is not used to avoid exposing the underlying data array directly.

                @public
                @name dotcloud.sync.AbstractArray#filter
                @function
                @param {Function} fn
                @param {Object} that
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/filter">MDN > filter</a>            */
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

            /**
                forEach.

                @description
               

                @public
                @name dotcloud.sync.AbstractArray#forEach
                @function
                @param {Function} fn iterator function
                @param {Object} [that]
                @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/forEach">MDN > forEach</a>
            */
            this.forEach = function(fn, that) {
                var data = this.__data();
                for (var i = 0, l = this.length; i < l; i++) {
                    var val = data[i];
                    fn.call(that, val, i, this);
                }
            };

            /**
                Every.
    
                @description
                
                @public
                @name dotcloud.sync.AbstractArray#every
                @function
                @param {Function} fn Iterator function
                @param {Object} [that]
                @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/every">MDN > every</a>

            */
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

            /** 
                some.

                @description

                @public
                @name dotcloud.sync.AbstractArray#some
                @function
                @param {Function} fn
                @param {that} that
                @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/some">MDN > some</a>
            */
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

            /** 
                reduce.

                @description

                @public
                @name dotcloud.sync.AbstractArray#reduce
                @function
                @param {Function} fn
                @param {Object} init
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce">MDN > Reduce</a>            */
            this.reduce = function(fn, init) {
                var data = this.__data();
                var cur = (init !== undefined) ? init : data[0];
                for (var i = (init !== undefined) ? 0 : 1, l = this.length; i < l; i++) {
                    cur = fn(cur, data[i], i, this);
                }
                return cur;
            };

            /** 
                reduceRight.

                @description

                @public
                @name dotcloud.sync.AbstractArray#reduceRight
                @function
                @param {Function} fn
                @param {Object} init
                @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight">MDN > ReduceRight</a>            */
            this.reduceRight = function(fn, init) {
                var data = this.__data();
                var cur = (init !== undefined) ? init : data[data.length - 1];
                for (var i = this.length - ((init !== undefined) ? 1 : 2); i >= 0; i--) {
                    cur = fn(cur, data[i], i, this);
                }
                return cur;
            };
        };

    

        /**
            Synchronized Array type, which is the return type of the `sync.synchronize` 
            method.

            @description
            It wraps a javascript array and provides the same methods.  
            Note: Since the underlying persistence layer has no order preservation, 
            order is discarded when using this structure. (push and unshift perform the 
            same operation, as well as pop and shift). If order is important to your
            application, you should use the `RedisArray`.

            @name dotcloud.sync#Array
            @lends dotcloud.sync
            @augments dotcloud.sync.AbstractArray
            @class
        */
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

        /**
            This method is not a standard Array method. It allows accessing the 
            item present at the specified `index`.  
            
            @description
            If the second parameter is provided, the objects will be merged and an
            update command will be sent to the underlying persistence layer.
            
            @public
            @name dotcloud.sync.Array.prototype.at

            @function
            @param {Number} index
            @param {Object} [update]
        
        */
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

        /**
            pop.

            @description

            @name dotcloud.sync#pop  
            @public
            @function
            @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/pop">MDN > pop</a>
        */
        sync.Array.prototype.pop = function() {
            var data = this.__data(),
                cfg = this.__config();
            io.call(cfg.svcName, 'remove')(cfg.dbid, cfg.collection, data[data.length - 1]._id, 
                function(error, result) {
                    if (error) throw error;
                });

            return data[data.length - 1];
        };

        /**
            push.

            @description

            @name dotcloud.sync#push
            @public
            @function  
            @param {Object} obj
            @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push">MDN > push</a>        */
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

        /**
            shift.

            @description

            @name dotcloud.sync#shift
            @public
            @function
            @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift">MDN > unshift</a>        */
        sync.Array.prototype.shift = function() {
            var data = this.__data(),
                cfg = this.__config();

            io.call(cfg.svcName, 'remove')(cfg.dbid, cfg.collection, data[0]._id, function(error, result) {
                if (error) throw error;
            });
            return data[0];
        };

        /**
            splice.

            @description
            Note: the returned Array is a plain, non-synchronized Javascript array.

            @name dotcloud.sync#splice
            @public
            @function  
            @param {Number} index
            @param {Number} num
            @param {...Object} [obj]
            @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/splice">MDN > splice</a>        */
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

        /**
            unshift.

            @description

            @name dotcloud.sync#push
            @public
            @function  
            @param {...Object} obj
            @seen <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift">MDN > unshift</a>        */
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
