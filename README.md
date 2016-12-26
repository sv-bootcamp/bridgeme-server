# BridgeMe - Server  <br>
BridgeMe is an iOS and Android mobile app where users find career counselors and have a 1:1 communication.<br>
This Repository is for our server-side source code. [This link](https://github.com/sv-bootcamp/bridgeme-client) is our client repository.<br><br>
[![Build Status](https://travis-ci.org/sv-bootcamp/bridgeme-server.svg?branch=master)](https://travis-ci.org/sv-bootcamp/bridgeme-server)

## Run Environment

#### Node.js (v7.2.0) - [Installation page](https://nodejs.org/ko/download/)
#### MongoDB (v3.2.11) - [Installation page](https://www.mongodb.com/download-center?jmp=docs#community)
#### Docker (v1.12.3)  - [Installation page](https://www.docker.com/products/docker#/linux)

## Using Docker
### Quick installation
```
mkdir ~/data
docker run -v ~/data:/data --name mongo -d mongo mongod --smallfiles
docker run -it \
    --link mongo:mongo \
    --rm mongo sh \
    -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'
```
### Run
```
//First, load env.prod.list file to ~/ folder. 
sudo docker pull bridgeme/bridgeme:{TAG_NAME}
docker run --link mongo:mongo -v ~/env.prod.list:/app/env.prod.list -p 80:5000 -d {IMAGE_ID}
```
## Using Gulp
### Quick installation
```
git clone https://github.com/sv-bootcamp/bridgeme-server.git
npm install -g gulp
npm install
sudo service mongod start
```
### Run
##### production<br>
    gulp prod
##### development<br>
    gulp
##### Unit testing<br>
    gulp test
## Documents
The latest API Document is [here](https://brdgeme.com).

## Wiki
[Go to wiki page](https://github.com/sv-bootcamp/bridgeme-server/wiki)

## Download application
<a href='https://play.google.com/store/apps/details?id=com.svbootcamp.bridgeme&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img height='50px' alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>
