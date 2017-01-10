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
		.catch(() => res.status(404).send('no more message'));
});

const addMessageService = function(queue, message) {
	return new Promise((resolve, reject) => {
		var queueService = azure.createQueueService(account, access_key);
		queueService.createQueueIfNotExists(queue, function(error) {
		if (!error) {
			queueService.createMessage(queue, message, function(error) {
				if (!error) {
					console.log('message inserted in queue "' + queue + '" : ' + message);
					resolve();
				} else { reject(error) }
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
				resolve(serverMessage.messageText);
			} else {
				reject('no more message');
			}
		});
    });
}

const compute = function(expression)  {
	return new Promise((resolve, reject) => {
		try {
			let evaluated = eval(expression);
			resolve(evaluated.toString());
		} catch (error) {
			reject(error);
		}
	});
}

const polling = function() {
	getMessageService('taskqueue')
		.then(compute)
		.then((evaluated) => addMessageService('resultqueue', evaluated))
		.catch(error => console.log(error));
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
