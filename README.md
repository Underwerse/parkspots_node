# web-app-backend

Media Sharing Web Application (Parkspots). Backend

## Table of content:

[Getting started](#getting-started)  
[API endpoints:](#api-endpoints)  
[Registration](#1-registration-of-the-new-user)  
[Login](#2-login-of-registered-user)  
[List of users](#3-getting-list-of-users)  
[User by id](#4-getting-user-by-userid)  
[List of parkspots](#5-getting-list-of-parkspots)  
[Add parkspot into DB](#6-adding-new-parkspot-into-db)  
[Get parkspots by user id](#7-getting-parkspots-by-user-id-parkspots-have-been-added-by-certain-user)  
[Delete parkspot by parkspot's id](#8-delete-parkspot-by-parkspots-id-parkspots-have-been-added-by-certain-user)  
[Add image by parkspot's id](#9-add-image-by-parkspots-id)  
[Get all images by parkspot's id](#10-get-all-images-by-parkspots-id)  

<a name="getting_started"></a>

## Getting started

Running app:
1. Instal dependences: 
```
npm i
```
2. Start application: 
```
npm run start
```


<a name="api_endpoints"></a>

## API-endpoints

<a name="registration"></a>

### 1. Registration of the new user:

URL: http://10.114.32.8/app/auth/registration  
Method: POST  
Content-Type: application/json  

body JSON format:
```json
{
  "name": "First name",
  "lastname": "Last name",
  "password": "asdf",
  "passwordConfirmation": "asdf",
  "email": "test@gmail.com",
  "theme_color": ""             // default for all users, optional
}
```

There is server-side input-fields validation, for UI-purposes and good UX/UI, it should be on client-side too (first of all).

Response cases:

- successfull registration:
```json
{
  "message": "User has been registered",
  "user": {
    "name": "First name",
    "lastname": "Last name",
    "email": "test@gmail.com",
    "theme_color": "",
    "id": 6
  },
  "isExisted": false            // before registration user didn't exist
}
```

- user (with provided email) already exists in the DB (has been registered before):
```json
{
  "message": "User already exists",
  "isExisted": true
}
```

- wrong inputs (email, passwordConfirmation):
```json
{
  "message": "Validation errors",
  "errors": [
    {
      "value": "test3@gmail",
      "msg": "must be email with 6-30 chars length",
      "param": "email",
      "location": "body"
    },
    {
      "value": "asdf2",
      "msg": "Password confirmation is incorrect",
      "param": "passwordConfirmation",
      "location": "body"
    }
  ]
}
```

<a name="login"></a>

### 2. Login of registered user

URL: http://10.114.32.8/app/auth/login  
Method: POST  
Content-Type: application/json  

body JSON format: 
```json
{
  "email": "test@gmail.com",
  "password": "asdf"
}
```
Response cases:

- successfull login:
```json
{
  "isLogged": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6MCwiaWF0IjoxNjUxMTIyMTAyLCJleHAiOjE2NTEyMDg1MDJ9.SquXdf_9dI9Ew4k5YSNo-1kuZ0KAOq6OFhYwyyWfH1w"
}
```
- failed login:

    -- wrong provided email:
```json
    {
        "message": "user with email 'tes@gmail.com' not found in the DB"
    }
```
    -- wrong password (if email has been found):
```json
    {
        "message": "password incorrect"
    }
```

<a name="get_all_users"></a>

### 3. Getting list of users

URL: http://10.114.32.8/app/auth/users  
Method: GET  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

Response cases: 

- when logged user is not the administrator (whos admin's role is 99):
```json
{
  "isLogged": true,
  "userId": 5,
  "hasRight": false,
  "message": "You have no right for this content"
}
```
- when logged user is the admin (his role is 99):
```json
[                           // Array with all found users
  {
    "id": 1,
    "name": "Admin",
    "lastname": "",
    "email": "admin@gmail.com",
    "password": "$2a$07$Dq96IK6O6DAYPcAlZFXtferXZaJLIW9A5QaornihhnA3mEB4rFCyu",
    "role": 99,
    "theme_color": ""
  },
  {
    "id": 2,
    "name": "Mikka",
    "lastname": "Hakkinen",
    "email": "mikka@gmail.com",
    "password": "$2a$07$DNtslP5DYcQu4aBRISGmgewgb7YKpkaSdvkWKtznsR/UjX1xSfo/O",
    "role": 0,
    "theme_color": ""
  },
                        // all the users found from DB
  {
    "id": 7,
    "name": "test3",
    "lastname": "registration3",
    "email": "test3@gmail.com",
    "password": "$2a$07$SUC3Kqk8Xja/njgHpSt9Zulk./XctUr7sVvv0t4GbVd8EqfMWfENi",
    "role": null,
    "theme_color": ""
  }
]
```

<a name="get_user_by_id"></a>

### 4. Getting user by userId

URL: http://10.114.32.8/app/auth/user/5     // "5" is the requested userId  
Method: GET  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

Response cases: 

- logged user is admin (he has rights to get any user from DB by userId):
```json
{
  "id": 5,
  "name": "test",
  "lastname": "registration",
  "email": "test@gmail.com",
  "role": 0,
  "theme_color": ""
}
```
- logged user is not admin (he has no rights to get any user from DB by userId):
    --  user tryes to get itself (logged user id and requested id are the same):
```json
    {
      "id": 6,
      "name": "test2",
      "lastname": "registration2",
      "email": "test2@gmail.com",
      "role": 0,
      "theme_color": ""
    }
```
    --  user tryes to get another user (logged user id and requested id are NOT the same):
```json
    {
      "isLogged": true,
      "userId": 6,
      "hasRight": false,
      "message": "You have no right for this content"
    }
```

<a name="get_all_parkspots"></a>

### 5. Getting list of parkspots

URL: http://10.114.32.8/app/parkspots  
Method: GET  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

Response case:
```json
{
  "isLogged": true,
  "userId": 1,
  "hasRight": true,
  "parkspots": [                // Array with all found parkspots
    {
      "id": 1,
      "lat": null,
      "long": null,
      "address": "Espoo, Siltakija 2",
      "duration": 8,
      "parkqty": 20,
      "electricqty": 0,
      "userId": 5
    },
        	                // All the parkspots found from DB
    {
      "id": 2,
      "lat": null,
      "long": null,
      "address": "Helsinki, Aleksanterinkatu 55",
      "duration": 2,
      "parkqty": 4,
      "electricqty": 1,
      "userId": 5
    }
  ]
}
```

<a name="add_parkspot"></a>

### 6. Adding new parkspot into DB

URL: http://10.114.32.8/app/parkspots/add  
Method: POST  
Content-Type: application/json  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

body JSON format: 
```json
{
  "lat": "00.00.000",
  "lon": "00.00.000",
  "address": "Helsinki, Mukimäki 3",
  "duration": 2,
  "parkqty": 4,
  "electricqty": 0,
  "userId": 8
}
```  

Response case:
```json
{
  "isLogged": true,
  "hasRight": true,
  "parkspot": {
    "lat": "00.00.000",
    "lon": "00.00.000",
    "address": "Helsinki, Mukimäki 3",
    "duration": 2,
    "parkqty": 4,
    "electricqty": 0,
    "userId": 8,
    "id": 8
  }
}
```

<a name="parkspots_by_user"></a>

### 7. Get parkspots by user id (parkspots have been added by certain user)

URL: http://10.114.32.8/app/parkspots/5      // "5" is the user id  
Method: GET  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

Response case:
```json
{
  "isDeleted": true,
  "userId": 1,
  "hasRight": true,
  "parkspots": [
    {
      "id": 1,
      "lat": "",
      "lon": "",
      "address": "Espoo, Siltakija 2",
      "duration": 8,
      "parkqty": 20,
      "electricqty": 0,
      "userId": 2
    },
    {
      "id": 2,
      "lat": "",
      "lon": "",
      "address": "Helsinki, Aleksanterinkatu 55",
      "duration": 2,
      "parkqty": 4,
      "electricqty": 0,
      "userId": 2
    }
  ]
}
```

### 8. Delete parkspot by parkspot's id (parkspots have been added by certain user)

Admin has the right to delete any user's parkspot, user has only right to delete his own added parkspots.

URL: http://10.114.32.8/app/delete/5      // "5" is the parkspot's id  
Method: POST  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

Response case:
```json
{
  "isDeleted": true
}
```

### 9. Add image by parkspot's id

URL: http://10.114.32.8/app/parkspots/add/image    
Method: POST  
Headers: Authorization : Bearer token-string from the response of the login-API (pos. 2)  

body JSON format: 
```json
{
  "parkspotId": 2
}
``` 
+ file (form-data)

Response case:
```json
{
    "userId": 1,
    "imageNewId": 6
}
```

### 10. Get all images by parkspot's id

Everybody who logged in can see clicked parkspot's images.

URL: http://10.114.32.8/app/images/4    
Method: POST  
Headers: 
  'Content-Type': 'application/json',
  Authorization : Bearer token-string from the response of the login-API (pos. 2)  
``` 

Response case:
```json
{
	"images": [
		{
			"id": 4,
			"filename": "2022-04-19_13-08-32.png-1651751202394.png",
			"parkspotId": 1,
			"timestamp": "2022-05-05T11:46:42.000Z"
		},
		{
			"id": 5,
			"filename": "2022-04-19_13-08-44.png-1651751211255.png",
			"parkspotId": 1,
			"timestamp": "2022-05-05T11:46:51.000Z"
		},
		{
			"id": 6,
			"filename": "2022-04-19_13-08-53.png-1651751220018.png",
			"parkspotId": 1,
			"timestamp": "2022-05-05T11:47:00.000Z"
		}
	]
}
```