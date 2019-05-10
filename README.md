# Twitter - Speedtest

## Overview

This application consists of two parts:

* **app** - a node.js script that runs the *speedtest-cli* command and saves the output. TODO: write output to firebase firestore.
* **functions** - a firebase function that tweets when a speedtest result is uploaded to firebase firestore

These scripts can be modified to work separately or together.

*All the twitter functionality is currently in the **firebase** module*

## Getting Started

`app` assumes you are running on a system that can schedule tasks to be run at a given interval. In this example we use *crontab-ui* to run `app/index.js` at a given interval.

`firebase` assumes you have created a new firebase project in the [firebase console](https://console.firebase.google.com)

### Prerequisites

* [npm](https://www.npmjs.com/get-npm)
* [node.js](https://nodejs.org/en/download/)
* [speedtest-cli](https://github.com/sivel/speedtest-cli)
* [firebase-cli](https://firebase.google.com/docs/cli) - optional
* [crontab-ui](https://github.com/alseambusher/crontab-ui) - optional 

Install any dependencies needed by running

```
$ npm install
```

You will also need `speedtest-cli` installed globally. You can install this by running

```
$ npm install -g speedtest-cli
```

### **Crontab UI**

CRON is a time-based scheduler that we can use to execute our code at a given interval. In this case, we are going to configure our OS to run `app/index.js` every hour. We can use crontab to accomplish this. I am using `crontab-ui`, which provides a nice GUI to create/edit our CRON jobs.

#### Install

```
$ npm install -g crontab-ui
```

#### Usage

```
$ crontab-ui
```

* Serves a local webpage at http://127.0.0.1:8000
* Click 'New' and give your application a name
* Command: node PATH/TO/APP/index.js

[crontab.guru](https://crontab.guru/) is a great resource for configuring CRON schedules. To run our application every hour we will simply set our cron expression to 

```
0 * * * *
```

### **Twitter**

We need to setup a develop account on Twitter and create a Twitter application. We will then create auth tokens we can use to tweet on our behalf.

* Create a [Twitter Developer Account](https://developer.twitter.com)
* Create a new [Twitter Application](https://developer.twitter.com/en/apps/create)
* After the application has been successfully created, navigate to your application and to the *Keys and tokens* tab.
* Generate an Access Token that has read/write permissions
* Copy down all four keys
    * API key
    * API secret key
    * Access token
    * Access token secret

### **app module**

This script does three things:

1. Locates a server in `Toronto`
2. Runs a speed test for the server in *Step 1*
3. Writes the output to a json file

You can replace `Toronto` with a server of your choise or get rid of the first step entirely. If no server is set, the script will use the closet server to your location.

To find out more configuration options, see the documentation for [speedtest-cli](https://github.com/sivel/speedtest-cli)

#### Firebase

TODO: Implement firebase

Upload the speedtest results to *firebase firestore*

### **firebase module**

This module assumes you have configured the `app` module to upload the speedtest results to *firebase firestore*.

#### Environment Variables

Set your twitter keys with the following command:

```
$ firebase functions:config:set twitter.consumer_key="THE CONSUMER KEY" twitter.consumer_secret="THE CONSUMER SECRET" twitter.token="THE ACCESS TOKEN" twitter.token="THE TOKEN SECRET"
```

#### Configuration

There are a few fields that are easily configurable:

```
const THRESHOLD = 4194304; // 4 MiB in bits
const MONTHLY_PAYMENT = 44.99; // in USD
const DOWNLOAD_SPEED = 100; // MiB
```

#### Deploy

```
$ firebase deploy --only functions
```

#### Testing

Create a collection called `results` with a document that has a number field called `download` and a value less than `THRESHOLD`. This should trigger the firebase function and send out a tweet.