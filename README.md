# GSDA - Genetic Suite Development Assistant

## I. Introduction
This application is a training project for Node.js, Express.js, Bootstrap and MongoDB
in which I'm trying to build application that will help integrate Redmine and SoftDev applications.

## II. Required Software
To run this application you need to have installed or have access to:    

* Node.js
* MongoDB
* Redmine
* SoftDev

## III. Configuration

Path /configuration/env_configuration/configurations/   

need to contains files dev_config.cfg and prod_config.cfg (used when app run in production mode).   

To have this application working correcly those files need to contains below variables:   

* CONFIGURATION_NAME -> Configuration name displayed when application is starting
* APP_PORT -> Port on which our application is listening
* REDMINE_ADDRESS -> Redmine application address
* REDMINE_API_KEY -> Redmine API Key
* CACHE_TTL -> Cache Time To Live in seconds
* MONGO_DB_ADRESS -> Mongo DB adress
* SESSION_SECRET -> Application session secret string
* SESSION_NAME= Application session name