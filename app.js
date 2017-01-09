'use strict';
const azure = require('azure-storage');

const account = 'mgn'
const access_key = 'fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ=='

var queueService = azure.createQueueService(account, access_key);
queueService.createQueueIfNotExists('taskqueue', function(error) {
    if (!error) {
        queueService.createMessage('taskqueue', process.argv[2], function(error) {
            if (!error) {
                console.log('message inserted: ' + process.argv[2]);
            }
        });
    }
});