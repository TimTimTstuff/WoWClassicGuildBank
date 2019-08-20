# Backend / Api

## knownd issues
- upper and lower case problem with the header token name. 
    - The system expects case matching tokens, i had the issue that a apache hat a first letter uppercase token even if i send it as all lower case. Check in the index where you set the token name. 
- API always returns "API Base not implemented"
    - the $basePath is not set correct. To check the error do a debug call ?debug=1 when use call any entity (exc. localhost/api/user). And check if user is the entity or check the raw info. Adjust the path if needed. 

## Calling the Api
1. all requests have to be bound to entites. That includes basic CRUD requests and also actions. 

## Authentication
- The authentication is only done by a token which is send in the headers (customizable)
    - currently its a md5() generated string which is send with the "token" header and its checked with the user in the db. 
    - you can extract the token from the local storage if logged in over the current client. Or generate a new one over the user Login method. 

## CRUD
  | Action  | Method | Call              | data          | example               | comments      |
  | --      | --     |--                 | --            |--                     |--             |
  | Create  | POST   | {entity}          | json object   | localhost/api/user    | creates a user| 
  | Update  | PUT    | {entiy}/{id}      | json object   | localhost/api/user/1  | updates the user with the id 1 |
  | Read    | GET    | {entity}/{opt id} | empty         | localhost/api/user or localhost/api/user/1 | returns all / user with id 1 |
  | Delete  | DELETE | {entity}/{id}     | empty         |localhost/api/user/1   | deletes user with id 1 |


## custom actions
Custom actions can also only be called on entitys and have always a body (even if its an empty object). 
Example: user Login

| Action | Method | Call | data |
| login   | POST | localhost/api/user/login | json object "{username:'username', password:'password'} |


