

## Timezones API

Rest API for the timezones project

Instructions to run in local environment:

* Have XAMPP installed
* Have mysql database with name 'api' (or change database name in .env file)
* Have composer installed

1. rename .env.example to .env
2. run "composer install" //install dependencies
3. run "php artisan key:generate" //generate application key
4. run "php artisan passport:keys" //generate keys for oauth2 server
5. run "php artisan migrate:fresh --seed" //create database tables and seed with generated data
6. run "php artisan serve" //serve the application on local server
7. use Postman test suite and Postman API collection for testing (Run in Postman):

tests:
https://documenter.getpostman.com/view/2013039/UzJLPwW9

If you would like to send emails, you can enable email sending by setting 
EMAILS_ENABLED=true in .env, for this you will need to set in your .env file Mailgun credentials:

MAILGUN_DOMAIN=sandboxcf51eed6663046838d4a031c651313ae.mailgun.org
MAILGUN_SECRET=key-eea889b53d413c46e012cd5bcfad2ebf

You can also set FORCE_EMAIL_VERIFY=true if you want to force users to verify emails before giving
them access to the API
