var BusService = require('replay-bus-service'),
    JobsService = require('replay-jobs-service');

// have to pre-define the video file exetnsions since Kaltura providers only the name without the extension.
var videoFileExtension = '.ts';

module.exports = {

    onUploadFinished: function(req, res, next) {
        if (!validateInput(req.body)) {
            console.log("Bad input was received.");
            next(err);
        }

        produceNewVideoJob(req.body.entryId, req.body.name);
        res.ok();
    }
}

function validateInput(requestBody) {
    if (!requestBody.entryId || !requestBody.name) {
        return false;
    }

    return true;
}

function produceNewVideoJob(entryId, videoName) {
    // get the matching queue name of the job type
    queueName = JobsService.getQueueName('FetchVideoFromProvider');

    // create bus
    var busService = new BusService(process.env.REDIS_HOST, process.env.REDIS_PORT);

    var message = {
        params: {
            provider: 'kaltura',
            providerId: entryId,
            name: videoName + videoFileExtension
        }
    }

    busService.produce(queueName, message);
}
