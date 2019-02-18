namespace feng3d
{
    var databases: { [name: string]: IDBDatabase } = {};

    /**
     * 
     */
    export var _indexedDB: _IndexedDB;

    /**
     * 
     */
    export class _IndexedDB
    {
        /**
         * 数据库状态
         */
        private _dbStatus: {
            [dbname: string]: {
                /**
                 * 状态
                 */
                status: DBStatus,
                /**
                 * 开启或者升级成功回调
                 */
                onsuccessCallbacks: ((err: Error, database: IDBDatabase) => void)[],
                /**
                 * 升级回调
                 */
                onupgradeneededCallbacks: ((newdatabase: IDBDatabase) => void)[],
            }
        } = {};

        /**
         * 是否支持 indexedDB 
         */
        support()
        {
            if (typeof indexedDB == "undefined")
            {
                indexedDB = window.indexedDB || window["mozIndexedDB"] || window["webkitIndexedDB"] || window["msIndexedDB"];

                if (indexedDB == undefined)
                {
                    return false;
                }
            }
            return true;
        }

        /**
         * 获取数据库，如果不存在则新建数据库
         * 
         * @param dbname 数据库名称
         * @param callback 完成回调
         */
        getDatabase(dbname: string, callback: (err: any, database: IDBDatabase) => void)
        {
            if (databases[dbname])
            {
                callback(null, databases[dbname]);
                return;
            }

            this._open(dbname, callback);
        }

        /**
         * 打开或者升级数据库
         * 
         * @param dbname 数据库名称
         * @param callback 完成回调
         * @param upgrade 是否升级数据库
         * @param onupgrade 升级回调
         */
        private _open(dbname: string, callback: (err: any, database: IDBDatabase) => void, upgrade = false, onupgrade?: (newdatabase: IDBDatabase) => void)
        {
            if (!this._dbStatus[dbname]) this._dbStatus[dbname] = { status: DBStatus.unOpen, onsuccessCallbacks: [], onupgradeneededCallbacks: [] };

            this._dbStatus[dbname].onsuccessCallbacks.push(callback);
            if (upgrade)
            {
                feng3d.assert(!!onupgrade);
                this._dbStatus[dbname].onupgradeneededCallbacks.push(onupgrade);
            }
            if (this._dbStatus[dbname].status == DBStatus.opening || this._dbStatus[dbname].status == DBStatus.upgrading) return;

            var request: IDBOpenDBRequest;
            if (!upgrade)
            {
                request = indexedDB.open(dbname);
                this._dbStatus[dbname].status = DBStatus.opening;
            } else
            {
                var oldDatabase = databases[dbname];
                oldDatabase.close();
                delete databases[dbname];

                request = indexedDB.open(dbname, oldDatabase.version + 1);
                this._dbStatus[dbname].status = DBStatus.upgrading;
            }

            request.onupgradeneeded = (event) =>
            {
                var newdatabase: IDBDatabase = event.target["result"];
                request.onupgradeneeded = null;

                var callbacks = this._dbStatus[dbname].onupgradeneededCallbacks.concat();
                this._dbStatus[dbname].onupgradeneededCallbacks.length = 0;
                callbacks.forEach(element =>
                {
                    element(newdatabase);
                });
            }
            request.onsuccess = (event) =>
            {
                databases[dbname] = event.target["result"];
                request.onsuccess = null;

                this._dbStatus[dbname].status = DBStatus.opened;

                var callbacks = this._dbStatus[dbname].onsuccessCallbacks.concat();
                this._dbStatus[dbname].onsuccessCallbacks.length = 0;
                callbacks.forEach(element =>
                {
                    element(null, databases[dbname]);
                });
            };
            request.onerror = (event) =>
            {
                request.onerror = null;

                this._dbStatus[dbname].status = DBStatus.error;

                var callbacks = this._dbStatus[dbname].onsuccessCallbacks.concat();
                this._dbStatus[dbname].onsuccessCallbacks.length = 0;
                callbacks.forEach(element =>
                {
                    element(<any>event, <any>null);
                });
            };
        }

        /**
         * 删除数据库
         * 
         * @param dbname 数据库名称
         * @param callback 完成回调
         */
        deleteDatabase(dbname: string, callback?: (err: any) => void)
        {
            var request = indexedDB.deleteDatabase(dbname);
            request.onsuccess = function (event)
            {
                delete databases[dbname];
                callback && callback(null);
                request.onsuccess = null;
            };
            request.onerror = function (event)
            {
                callback && callback(event);
                request.onerror = null;
            };
        }

        /**
         * 是否存在指定的对象存储
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param callback 完成回调
         */
        hasObjectStore(dbname: string, objectStroreName: string, callback: (has: boolean) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                callback(database.objectStoreNames.contains(objectStroreName));
            });
        }

        /**
         * 获取对象存储名称列表
         * 
         * @param dbname 数据库
         * @param callback 完成回调
         */
        getObjectStoreNames(dbname: string, callback: (err: Error | null, objectStoreNames: string[]) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                var objectStoreNames: string[] = [];
                for (let i = 0; i < database.objectStoreNames.length; i++)
                {
                    objectStoreNames.push(<string>database.objectStoreNames.item(i));
                }
                callback(null, objectStoreNames)
            });
        }

        /**
         * 创建对象存储
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param callback 完成回调
         */
        createObjectStore(dbname: string, objectStroreName: string, callback?: (err: any) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                if (database.objectStoreNames.contains(objectStroreName))
                {
                    callback && callback(null);
                    return;
                }

                this._open(dbname, callback, true, (newdatabase: IDBDatabase) =>
                {
                    newdatabase.createObjectStore(objectStroreName);
                });
            });
        }

        /**
         * 删除对象存储
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param callback 完成回调
         */
        deleteObjectStore(dbname: string, objectStroreName: string, callback?: (err: any) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                if (!database.objectStoreNames.contains(objectStroreName))
                {
                    callback && callback(null);
                    return;
                }
                this._open(dbname, callback, true, (newdatabase: IDBDatabase) =>
                {
                    newdatabase.deleteObjectStore(objectStroreName);
                });
            });
        }

        /**
         * 获取对象存储中所有键列表
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param callback 完成回调
         */
        getAllKeys(dbname: string, objectStroreName: string, callback?: (err: Error, keys: string[]) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                try
                {
                    var transaction = database.transaction([objectStroreName], 'readwrite');
                    var objectStore = transaction.objectStore(objectStroreName);
                    var request = objectStore.getAllKeys();
                    request.onsuccess = function (event)
                    {
                        callback && callback(null, event.target["result"]);
                        request.onsuccess = null;
                    };
                } catch (error)
                {
                    callback && callback(error, null);
                }
            });
        }

        /**
         * 获取对象存储中指定键对应的数据
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param key 键
         * @param callback 完成回调
         */
        objectStoreGet(dbname: string, objectStroreName: string, key: string | number, callback?: (err: Error, data: any) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                var transaction = database.transaction([objectStroreName], 'readwrite');
                var objectStore = transaction.objectStore(objectStroreName);
                var request = objectStore.get(key);
                request.onsuccess = function (event)
                {
                    var result = event.target["result"];
                    callback && callback(result ? null : new Error(`没有找到资源 ${key}`), result);
                    request.onsuccess = null;
                };
            });
        }

        /**
         * 设置对象存储的键与值，如果不存在指定键则新增否则修改。
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param key 键
         * @param data 数据
         * @param callback 完成回调
         */
        objectStorePut(dbname: string, objectStroreName: string, key: string | number, data: any, callback?: (err: Error) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                try
                {
                    var transaction = database.transaction([objectStroreName], 'readwrite');
                    var objectStore = transaction.objectStore(objectStroreName);
                    var request = objectStore.put(data, key);
                    request.onsuccess = function (event)
                    {
                        callback && callback(null);
                        request.onsuccess = null;
                    };
                } catch (error)
                {
                    callback && callback(error);
                }
            });
        }

        /**
         * 删除对象存储中指定键以及对于数据
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param key 键
         * @param callback 完成回调
         */
        objectStoreDelete(dbname: string, objectStroreName: string, key: string | number, callback?: (err?: Error) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                try
                {
                    var transaction = database.transaction([objectStroreName], 'readwrite');
                    var objectStore = transaction.objectStore(objectStroreName);
                    var request = objectStore.delete(key);
                    request.onsuccess = function (event)
                    {
                        callback && callback();
                        request.onsuccess = null;
                    };
                } catch (error)
                {
                    callback && callback(error);
                }
            });
        }

        /**
         * 清空对象存储中数据
         * 
         * @param dbname 数据库名称
         * @param objectStroreName 对象存储名称
         * @param callback 完成回调
         */
        objectStoreClear(dbname: string, objectStroreName: string, callback?: (err?: Error) => void)
        {
            this.getDatabase(dbname, (err, database) =>
            {
                try
                {
                    var transaction = database.transaction([objectStroreName], 'readwrite');
                    var objectStore = transaction.objectStore(objectStroreName);
                    var request = objectStore.clear();
                    request.onsuccess = function (event)
                    {
                        callback && callback();
                        request.onsuccess = null;
                    };
                } catch (error)
                {
                    callback && callback(error);
                }
            });
        }
    }

    _indexedDB = new _IndexedDB();

    /**
     * 数据库状态
     */
    enum DBStatus
    {
        /**
         * 未开启
         */
        unOpen,

        /**
         * 正在开启中
         */
        opening,

        /**
         * 已开启
         */
        opened,

        /**
         * 正在升级中
         */
        upgrading,

        /**
         * 开启或者升级失败
         */
        error,
    }
}