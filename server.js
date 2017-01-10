const azure = require('azure-storage');
const express = require('express');
const app = express();

const account = 'mgn'
const access_key = 'fWFWgqF9rQorp/iGlg05tRnV+8iHnbF8ANCGTDjFJxJSKIUMVzGEU9rq9GhGgZCy+m2+ubZxX1AbFEguIYX+YQ=='

app.get('/', (req, res) => res.send('Running'));

app.post('/add/:message', function(req, res) {
	addMessageService('taskqueue', req.params.message)
		.then(() => res.send('success'))
		.catch(() => res.send('error'));
});

app.get('/getmessage', function(req, res) {
	getMessageService('taskqueue')
		.then(result => res.send(result))
		.catch(() => res.send('no more message'));
});

const addMessageService = function(queue, message) {
	return new Promise((resolve, reject) => {
		var queueService = azure.createQueueService(account, access_key);
		queueService.createQueueIfNotExists(queue, function(error) {
		if (!error) {
			queueService.createMessage('taskqueue', message, function(error) {
				if (!error) {
					console.log('message inserted: ' + message);
					resolve();
				}
			});
		} else  {
			reject(error);
		}
	});
	})
}

const getMessageService = function(queue) {
	return new Promise((resolve, reject) => {
		var queueService = azure.createQueueService(account, access_key);
		var queueName = queue;
		queueService.getMessage(queueName, function(error, serverMessage) {
			if (!error && serverMessage) {
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

const polling = function() {
	console.log(new Date());
}
setInterval(polling, 1000);

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
