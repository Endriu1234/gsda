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
* REDMINE_TMS_TASK_NAME -> Redmine name of field refering to TMS task
* REDMINE_CR_NAME -> Redmine name of field refering to CR
* REDMINE_ISSUE_NAME -> Redmine name of field refering to Issue
* CACHE_TTL -> Cache Time To Live in seconds
* MONGO_DB_ADRESS -> Mongo DB adress
* SESSION_SECRET -> Application session secret string
* SESSION_NAME= Application session name
* ORACLE_CLIENT_PATH -> path to Oracle Client
* SOFTDEV_DB_USER -> SoftDev DB user
* SOFTDEV_DB_PASS -> SoftDev DB pass
* SOFTDEV_DB_HOST -> SoftDev DB host
* SOFT_DEV_DB_PORT -> SoftDev DB port
* SOFT_DEV_DB_SID -> SoftDev SID
* COOKIE_MAX_AGE -> Cookie Max Age