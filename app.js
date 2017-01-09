'use strict';
const azure = require('azure-storage');

// Define environment
process.env.AZURE_STORAGE_ACCOUNT = 'mgn'
process.env.AZURE_STORAGE_ACCESS_KEY = 'fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ=='
process.env.AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=mgn;AccountKey=fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ==;'

var queueService = azure.createQueueService();
queueService.createQueueIfNotExists('taskqueue', function(error) {
    if (!error) {
        queueService.createMessage('taskqueue', process.argv[2], function(error) {
            if (!error) {
                console.log('message inserted: ' + process.argv[2]);
            }
        });
    }
});