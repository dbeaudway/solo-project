# Table Topics - Prime Solo Project

Table Topics is a website that allows users to stay up-to-date on current activities in Congress. This includes upcoming bills, recent vote role calls, and profiles of all members in the Senate and House.
Users have the option to register which allows them to start conversations on representatives profiles and specific bills. Additionally, users can record video respones from their computers.

## Built With

- MongoDB
- Express.js
- AngularJS
- Node.js
- Amazon Web Services S3
- Heroku

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to run this application locally you will need an account with Amazon Web Services and a database service application to support MongoDB, such as Robo 3T.

Once you've created an Amazon Web Services account you will need to create a S3 bucket with full public-access privileges. This link contains a great step-by-step walkthrough on how to configure your Amazon S3 settings: https://devcenter.heroku.com/articles/s3-upload-node


### Installing

1. Clone or download the repository locally
2. Enter ```npm install``` into terminal
3. Enter ```npm start``` into terminal to spin up local
4. Visit localhost:5000 in your browser to view the website

## Screen Shots
Home Page:
![Alt text](https://github.com/dbeaudway/solo-project/blob/master/screenshots/home-page.png "Home Page")

Congress Member Page:
![Alt text](https://github.com/dbeaudway/solo-project/blob/master/screenshots/profile-page.png "Congress Member Page")

Bill Page:
![Alt text](https://github.com/dbeaudway/solo-project/blob/master/screenshots/bill-page.png "Bill Page")

Vote Page:
![Alt text](https://github.com/dbeaudway/solo-project/blob/master/screenshots/vote-page.png "Vote Page")


### Primary Application Features

- [x] Profiles for all members of the Senate and House of Representatives
- [x] Detailed information for all bills and legislation in Congress
- [x] Voting role calls and outcomes for all bills considered in Congress
- [x] Registration and authentication for website visitors to create profiles
- [x] Ability for users to comment and vote on pages
- [x] Ability for users to leave video comments (content hosted using Amazon S3)

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

* David Beaudway


## Acknowledgments

* Big thanks to the team behind the ProPublica Congress API for making this important public information easily accessible (https://projects.propublica.org/api-docs/congress-api/).
