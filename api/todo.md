# Backend Todo

## Needed Missing Features
- User/Action - Logout 
    - invalidate the current user token

## General Tasks
- Refactor API classes
- Cache BaseEntityController Table Data

## API Communication
- on the root: Return all existing entities or even a api documentation in json (generated)
- create a unified way of responses:  1 record = object, multiple objects = array. All errors as "api exceptions" empty arrays as array and if a record is called which not exists as api exception
- create a default way to add entity references and optionsets. Maybe with Navigation properties. 

## Base Entity Controller
- the pre/post methods a not working as hoped. you have to return the changed array and in the controller set the values if not null. Check: get() method. 

## Planned Features