'use strict';
const azure = require('azure-storage');


const account = 'mgn'
const access_key = 'fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ=='

var queueService = azure.createQueueService(account, access_key);
var queueName = 'taskqueue';
queueService.getMessages(queueName, function(error, serverMessages) {
  if (!error) {
    console.log(serverMessages[0].messageText);
 
    queueService.deleteMessage(queueName, serverMessages[0].messageId, serverMessages[0].popReceipt, function(error) {
      if (!error) {
        // Message deleted
      }
    });
  }
});