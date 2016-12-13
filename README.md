# BridgeMe - Server  <br>
BridgeMe is an iOS and Android mobile app where users find career counselors and have a 1:1 communication.<br>
This Repository is for our server-side source code. [This link](https://github.com/sv-bootcamp/wiki/wiki/Project-Yoda) is our client repository.<br><br>
[![Build Status](https://travis-ci.org/sv-bootcamp/bridgeme-server.svg?branch=master)](https://travis-ci.org/sv-bootcamp/bridgeme-server)

## Run Environment

#### Node.js (v7.2.0) - [Installation page](https://nodejs.org/ko/download/)
#### MongoDB (v3.2.11) - [Installation page](https://www.mongodb.com/download-center?jmp=docs#community)
#### Docker (v1.12.3)  - [Installation page](https://www.docker.com/products/docker#/linux)
## Quick installation
1. `git clone https://github.com/sv-bootcamp/bridgeme-server.git`
2. `npm install -g gulp`
3. `npm install`
4. `sudo service mongod start`
<br>

## Run - Gulp
1. `gulp`
<br>

## Run - Docker
1. `docker run -p 80:5000 --env-file env.list <IMAGE-ID> &`
<br>

## Unit test
`gulp test`
<br>
## Documents
The latest API Document is [here](https://brdgeme.com).

## Wiki
[Go to wiki page](https://github.com/sv-bootcamp/bridgeme-server/wiki)

## Download application
<a href='https://play.google.com/store/apps/details?id=com.svbootcamp.bridgeme&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img height='50px' alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>
