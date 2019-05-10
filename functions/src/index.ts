import * as functions from 'firebase-functions';
import * as Twitter from 'twitter';

/**
 * Configuration
 */
const THRESHOLD = 4194304; // 4 MiB in bits. divide by 1048576 to convert to megabits
const MONTHLY_PAYMENT = 44.99;
const DOWNLOAD_SPEED = 100;

// firebase functions:config:set twitter.consumer_key="THE CONSUMER KEY" twitter.consumer_secret="THE CONSUMER SECRET" twitter.token="THE ACCESS TOKEN" twitter.token="THE TOKEN SECRET"
const client = new Twitter({
    consumer_key: functions.config().twitter.consumer_key,
    consumer_secret: functions.config().twitter.consumer_secret,
    access_token_key: functions.config().twitter.token,
    access_token_secret: functions.config().twitter.token_secret
});

// invoked when a new document is created in the 'results' collection
exports.tweet = functions.firestore
    .document('results/{id}').onCreate((snap, _context) => {
        const result = snap.data();

        // get the download speed if document is available
        const download = (!result || result === null) ? -1 : result.download;

        // only tweet if the speed is unreasonable
        if(download > THRESHOLD) {
            return;
        }

        // helpful conversions
        const mib = download / 1048576;
        const price = (download / 1048576) * (MONTHLY_PAYMENT/DOWNLOAD_SPEED);
        const refund = MONTHLY_PAYMENT - price;

        // logging
        console.log(mib);
        console.log(price);
        console.log(refund);

        // configure your tweet here
        // let status = `Based on my speedtest results: ${mib.toFixed(2)} Mbps - I should be paying $${price.toFixed(2)} instead of $44.99.`;
        // status += ` @GetSpectrum can I get a refund of $${refund.toFixed(2)}?`;

        const status = `Speedtest results: ${mib.toFixed(2)} Mbps`;
       
        return client.post('statuses/update', {status: status});
    });