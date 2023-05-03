# Steamgames App

## Backend
### Quick Start
Place the `.env` file under `backend` folder to include the following information:
```
DB_host=
DB_user=
DB_password=
DB_name=
SECRET_KEY=
```

`cd backend` then `npm install` to install all required packages. Run `npm start` to start the server.

### REST APIs
#### User Routes (Authentication):
- `http://localhost:8800/api/users/register`
- `http://localhost:8800/api/users/login`
- `http://localhost:8800/api/users/logout`


#### Game Routes:
- `http://localhost:8800/api/games/search`
- `http://localhost:8800/api/games/search/:id`
- `http://localhost:8800/api/games/genreinfo`


#### Friend Routes:
- `http://localhost:8800/api/friends/friendlist`
- `http://localhost:8800/api/friends/remove`
- `http://localhost:8800/api/friends/add`
- `http://localhost:8800/api/friends/getstatus`
- `http://localhost:8800/api/friends/changestatus`
- `http://localhost:8800/api/friends/getnum`


#### History Routes:
- `http://localhost:8800/api/history/get`
- `http://localhost:8800/api/history/add`
- `http://localhost:8800/api/history/delete/:id`


#### Rating Routes:
- `http://localhost:8800/api/rating/get/:id`
- `http://localhost:8800/api/rating/set`


#### Report Routes:
- `http://localhost:8800/api/report/generate`


## Frontend
### Quick Start
`cd frontend` then `npm install` to install all required packages. Run `npm start` to start the react project.

### Pages
#### Register Page:
`http://localhost:3000/register`

#### Login Page:
`http://localhost:3000/login`

#### Home Page:
`http://localhost:3000/`

#### Report Page:
`http://localhost:3000/report`
