const azure = require('azure-storage');
const express = require('express');
const app = express();

const account = 'mgn'
const access_key = 'fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ=='

app.get('/', (req, res) => res.send('Running'));

app.post('/add/:message', function (req, res) {
	var queueService = azure.createQueueService(account, access_key);
	queueService.createQueueIfNotExists('taskqueue', function(error) {
		if (!error) {
			queueService.createMessage('taskqueue', req.params.message, function(error) {
				if (!error) {
					console.log('message inserted: ' + req.params.message);
					res.end();
				}
			});
		}
	});
});

app.get('/getmessage', function(req, res) {
	getMessageService().then(result => res.send(result));
});

const getMessageService = function() {
	return new Promise((resolve, reject) => {
		var queueService = azure.createQueueService(account, access_key);
		var queueName = 'taskqueue';
		queueService.getMessage(queueName, function(error, serverMessage) {
			if (!error) {
                queueService.deleteMessage(queueName, serverMessage.messageId, serverMessage.popReceipt, function(error) {
					if (!error) {
					// Message deleted
					}
				});
				resolve(serverMessage);
			} else {
				reject(error);
			}
		});
    });
}


function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

app.listen( normalizePort(process.env.PORT || '3000'), function () {
  console.log('Running on port ' + normalizePort(process.env.PORT || '3000'));
});
