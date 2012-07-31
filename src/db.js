/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/**

    Sub-module providing the simple storage API.

    @description
    Every method of this sub-module can be chained.
    Every method's callback is provided with <strong>two arguments</strong>: an `error` argument if 
    something occured server-side and a `result` argument containing the data returned by the 
    query, if any.
    <br />
    <h3>Authenticated user specific methods</h3>
    Evry method of this sub-modules can also be accessed through the <em>private</em> sub-object.
    It enable data persistence for the authenticated user.

    @example
// Query the whole collection of the current authenticated user
dotcloud.db.private.find('people', 
  function(data) {
    if (data.error) throw data.error;
    console.log(data.result);
  };
);

    @name dotcloud.db
    @namespace
*/
define(function(require) {
    return function(config, io) {
        var db = {
            /**
                Insert a element into a collection.

                @description  
                If an array is provided as the second argument, each element will be inserted in the
                specified collection.
                Result of this method contains the inserted object(s) with their newly-created _id.

                @public
                @name dotcloud.db#insert
                @function
                @param {String} collection The collection name
                @param {Object|Object[]} obj|objArray Either an element or an array of elements containing the data to insert.
                @param {Function} [callback] Function called when the insertion is done, the query result is passed as argument.

                @example
// Insert objects in the "people" collection
dotcloud.db.insert('people', [
   { firstname: 'John', lastname: 'Doe' },
   { firstname: 'Jane', lastname: 'Doe' }
 ], function(data){
  console.log("inserted with id: " + data.result[0]._id);
});
            */
            insert: function(collection, obj, cb) {
                io.call('db', 'insert')(config.dbid, collection, obj, cb);
                return this;
            },

            /**
                Update one or several objects a collection. 
                
                @description 
                Second argument can be an object ID or a MongoDB query object.
                Result of this method indicates the number of objects effected.

                @public
                @name dotcloud.db#update
                @function
                @param {String} collection The collection name
                @param {String|Object} id|criteria Either the ID of a MongoDB criteria object.
                @param {Function} [callback] The function to be called when the update is done, the query result is passed as argument.

                @example
// Increment the age field of all objects in people
dotcloud.db.update('people', {}, { $inc: { age: 1 }}, function() {
  console.log("entries updated");
});


            */
            update: function(collection, criteria, obj, cb) {
                io.call('db', 'update')(config.dbid, collection, criteria, obj, cb);
                return this;
            },

            /**
                Update one objects from collection.

                @description
                Remove an object in `collection` using its `id`, or drop the whole collection.  
                If the second argument is ommitted, the whole collection will be dropped.
                This method doesn't provide any result.

                @public
                @name dotcloud.db#remove
                @function
                @param {String} collection The collection name
                @param {[String]} id The id of the element to be removed
                @param {Function} [callback] Function called when the remove is done.

                @example
// Empty the "animals" collection
dotcloud.db.remove('animals', function() {
  console.log("entries removed");
});
            */
            remove: function(collection, id, cb) {
                if (!cb && (typeof id == 'function')) {
                    cb = id;
                    id = undefined;
                }
                io.call('db', 'remove')(config.dbid, collection, id, cb);
                return this;
            },

            /**
                Query a collection to retrieve one or several objects.

                @description
                The second argument can be an object ID or a MongoDB query object.
                If ommitted, the method will query the whole collection.

                @public
                @name dotcloud.db#find
                @function
                @param {String} collection The collection name
                @param {[String|Object]} [id|criteria] The id of the element or a MongoDB criteria object.
                @param {Function} [callback] Function called when the query has run, the query result is passed as argument.

                @example
// Query object having Doe as lastname
dotcloud.db.find('people', { lastname: 'Doe'}, 
  function(data) {
    if (data.error) throw data.error;
    console.log(data.result);
  };
);

// Query the whole collection
dotcloud.db.find('people', 
  function(data) {
    if (data.error) throw data.error;
    console.log(data.result);
  };
);
            */
            find: function(collection, criteria, cb) {
                if (!cb && (typeof criteria == 'function')) {
                    cb = criteria;
                    criteria = undefined;
                }

                io.call('db', 'find')(config.dbid, collection, criteria, cb);
                return this;
            },
            /**
                Update or insert an element.

                @description  
                Look for an object matching the given `criteria` in `collection`.  
                If found, update it with `obj`. Otherwise, insert `obj` as a new element.  
                `criteria` is a MongoDB query object.

                @public
                @name dotcloud.db#upsert
                @function
                @param {String} collection The collection name
                @param {[String|Object]} id|criteria The id of the element or a MongoDB criteria object.
                @param {Function} [callback] Function called when the query has run, the query result is passed as argument.

                @example
dotcloud.db.insert('people', { firstname: 'Jane', lastname: 'Doe' },
    function(data){
        console.log("inserted or updated element with id: " + data.result[0]._id);
    }
);

            */
            upsert: function(collection, criteria, obj, cb) {
                io.call('db', 'upsert')(config.dbid, collection, criteria, obj, cb);
                return this;
            },

            private: {
                // `db.insert(collection, obj|objArray, [cb])`  
                // Insert one or several objects in `collection`.  
                // If an array is provided as the second argument, each element will be inserted in the
                // specified collection.
                // Result of this method contains the inserted object(s) with their newly-created _id.
                insert: function(collection, obj, cb) {
                    io.call('db-private', 'insert')(config.dbid, collection, obj, cb);
                    return this;
                },
                // `db.update(collection, id|criteria, obj, [cb])`  
                // Update one or several objects in `collection`.  
                // Second argument can be an object ID or a MongoDB query object.
                // Result of this method indicates the number of objects effected.
                update: function(collection, criteria, obj, cb) {
                    io.call('db-private', 'update')(config.dbid, collection, criteria, obj, cb);
                    return this;
                },
                // `db.remove(collection, [id], [cb])`  
                // Remove an object in `collection` using its `id`, or drop the whole collection.  
                // If the second argument is ommitted, the whole collection will be dropped.
                // This method doesn't provide any result.
                remove: function(collection, id, cb) {
                    if (!cb && (typeof id == 'function')) {
                        cb = id;
                        id = undefined;
                    }
                    io.call('db-private', 'remove')(config.dbid, collection, id, cb);
                    return this;
                },
                // `db.find(collection, [id|criteria], [cb])`  
                // Query `collection` to retrieve one or several objects.  
                // The second argument can be an object ID or a MongoDB query object.
                // If ommitted, the method will query the whole collection.
                find: function(collection, criteria, cb) {
                    if (!cb && (typeof criteria == 'function')) {
                        cb = criteria;
                        criteria = undefined;
                    }

                    io.call('db-private', 'find')(config.dbid, collection, criteria, cb);
                    return this;
                },
                // `db.upsert(collection, criteria, obj, [cb])`  
                // Look for an object matching the given `criteria` in `collection`.  
                // If found, update it with `obj`. Otherwise, insert `obj` as a new element.  
                // `criteria` is a MongoDB query object.
                upsert: function(collection, criteria, obj, cb) {
                    io.call('db-private', 'upsert')(config.dbid, collection, criteria, obj, cb);
                    return this;
                }
            }
        };
        return db;
    };
});