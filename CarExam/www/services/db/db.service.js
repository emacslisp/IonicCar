/**
 *
 * This service will expose methods related to data storage;
 * Will expose methods to
 * 1. Initialise Database
 * 2. Migrate Database
 * 3. Query
 * 4. Fetch
 */

//@todo: let app.js call DBService function
(function () {
    "use strict";
    angular.module('CarExam')
        .factory('DBService', function ($cordovaSQLite, $http, $q, $log) {
            var db;
            var dbName = "wudilab-2016.db";
            var dbVersion = "2.0";
            var dbDisplayName = "WD DB";
            var tableExistsSql = "SELECT * FROM sqlite_master WHERE name = ? and type='table'";

            var migrateInternal = function (toVersion) {
                var q = $q.defer();
                if (db) {

                    $log.info('Migrating database to version ' + toVersion);

                    var filePath = 'db/' + dbVersion + '/migrate.sql';
                    $http({
                        url: filePath,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }).success(function (data, status, headers, config) {
                        $log.debug('Reading migration script content from ' + filePath);
                        $log.debug(data);
                        $log.debug("------------------------------------");

                        var SQLs = data.split(';');
                        db.transaction(
                            function (tx) {
                                for (var i = 0; i < SQLs.length; i++) {
                                    var SQL = SQLs[i].trim();

                                    if (SQL) {
                                        $log.debug(SQL);
                                        $log.debug("------------------------------------");
                                        tx.executeSql(SQL);
                                    }
                                }
                            },
                            function onError(err) {
                                $log.error(err);
                                return false;
                            }
                        );

                        $log.info('Database Migration to version ' + toVersion + ' completed.');
                        q.resolve({ initiated: true });
                    }).error(function (data, status, headers, config) {
                        $log.error(status);
                        $log.info('Database Migration to version ' + toVersion + ' failed.');
                        q.reject({ initiated: false });
                    });

                }

                return q.promise;
            };

            var fetchFirstInternal = function (result) {
                var output = null;
                if (result.rows.length) {
                    output = angular.copy(result.rows.item(0));
                }
                return output;
            }

            var getStorageDir = function () {
                switch (device.platform) {
                    case 'iOS':
                        return window.cordova.file.documentsDirectory;
                    case 'Android':
                        //return window.cordova.file.dataDirectory;
                        return window.cordova.file.externalDataDirectory
                }
                return '';
            };

            function openDatabase() {
                var q = $q.defer();
                if (window.cordova) {
                    var location = getStorageDir() + dbName;
                    //db = $cordovaSQLite.openDB(dbName, function (db) {
                    db = window.sqlitePlugin.openDatabase({
                        name: dbName,
                        androidDatabaseImplementation: 2,
                        androidLockWorkaround: 1
                    }, function (db) {
                        db.transaction(function (tx) {
                            $log.info("db opened");
                            q.resolve();
                        }, function (err) {
                            $log.info('Open database ERROR: ' + JSON.stringify(err));
                            q.reject(err);
                        });
                    }); //device
                } else {
                    db = window.openDatabase(dbName, dbVersion, dbDisplayName, 1024 * 1024 * 100); // browser
                    $log.debug('Using the WEBSql as database.');
                    q.resolve();
                }

                return q.promise;
            }

            return {
                tableExists: function (tableName) {
                    var q = $q.defer();
                    db.transaction(function (tx) {
                        tx.executeSql(tableExistsSql,
                            [tableName],
                            function (tx, results) {
                                // results is a http://dev.w3.org/html5/webdatabase/#sqlresultset .
                                // It has insertId, rowsAffected, and rows, which is
                                // essentially (not exactly) an array of arrays.
                                if (fetchFirstInternal(results)) {
                                    q.resolve({ tableExists: true });
                                } else {
                                    q.reject({ tableExists: false });
                                }
                            },
                            function (tx, error) {
                                $log.error(error);
                                q.reject(error);
                            }
                        );
                    });
                    return q.promise;
                },
                dropDatabase: function () {
                    var q = $q.defer();
                    if (window.cordova) {
                        $cordovaSQLite.deleteDB(dbName).then(function (result) {
                            q.resolve({ initiated: true });
                        });
                        $log.debug('Dropped SQLite database.' + dbName);
                    } else {
                        $log.debug('Can not drop a WebSql database.');
                        q.resolve({ initiated: true });
                    }

                    return q.promise;
                },
                closeDatabase: function () {
                    var q = $q.defer();
                    if (window.cordova) {
                        //Plugin has close method, while WEB SQL spec doen't specify close method.
                        db.close(function success() {
                            console.log("Database closed successfully");
                            q.resolve();
                        }, function error(err) {
                            console.log("Error occurred while closing database. " + err);
                            q.reject(err);
                        });

                    } else {
                        q.resolve();
                    }
                    return q.promise;
                },
                initDatabase: function (migrateVersion) {
                    var q = $q.defer();
                    openDatabase().then(function () {
                        return migrateInternal(migrateVersion);
                    }).then(function (result) {
                        q.resolve(result);
                    }).catch(function (error) {
                        $log.error("An error while initialising database: " + error);
                        q.reject(error);
                    });

                    return q.promise;
                },
                migrate: function (toVersion) {
                    var q = $q.defer();
                    migrateInternal(toVersion).then(function (result) {
                        q.resolve(result);
                    }, function (error) {
                        q.reject(error);
                    });
                    return q.promise;
                },
                doExecute: function (query, parameters) {
                    parameters = parameters || [];
                    var q = $q.defer();

                    $cordovaSQLite.execute(db, query, parameters)
                        .then(
                            function (result) {
                                q.resolve(result);
                            },
                            function (error) {
                                $log.error(error.message);
                                $log.debug("SQL: " + query);
                                $log.debug("Parameters: " + parameters);
                                q.reject(error);
                            }
                        );

                    return q.promise;
                },
                fetchAll: function (result) {
                    var output = [];

                    for (var i = 0; i < result.rows.length; i++) {
                        output.push(result.rows.item(i));
                    }
                    return output;
                },
                fetchFirst: function (result) {
                    return fetchFirstInternal(result);
                }
            };
        }
        );
})();