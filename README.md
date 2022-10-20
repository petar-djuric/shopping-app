
## Shopping app


### Setting up backend
- `cd backend`
- Run `cp .env.example .env`
- Run `composer install`
- Run `php artisan key:generate`
- Create a Database
- Update the Database credential in .env file (pusher and websockete data is already pre populated, replace as needed)
- Run `php artisan migrate`
- Run `php artisan db:seed --class=ListItemUnitSeeder`

### Starting up backend server
Start the integrated php server
- Run `php artisan serve` (default port 8000)

Start the larave-websockets server to serve realtime data.
- Run `php artisan websockets:serve` (default port 8000)

### Setting up frontend
`cd frontend`
- Run `cp .env.example .env`
- Update the host and port for the api server and websocket server in .env file

- Run `npm install`


### Starting up frontend server
- Run `npm run start` (default port 3000)



### Usage

Users can register and login
Each user can invite other users that arent part of any group using their email. Clicking on the upper left icon to add user to their group.

If a user is part of a group, they can not be invited to another group

Registered users do not have their own list, creating a new list also creates a new group for them.

Users with created lists can create, modify, or delete any list item, any person in a group can also create, modify, or delete any list item.

Websockets allow users to recive updates in realtime.

### Testing backend

- `cd backend`
- Create a test Database
- Update the .env.testing file with your database credentials
- Run `php artisan test --env=testing` (this will use the .env.testing for the testing enviroment. Change any details as needed)