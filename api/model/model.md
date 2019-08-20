# Redbean Model
We use the Readbean models for our own behavior with extensions

https://redbeanphp.com/index.php?p=/models

Model files will be included when a entity is requested.

Requred Filename:  {entity}.model.php

# Extended Model (Only BaseEntityController)

For CRUD exists an extra Pre and Post Action. This actions are called before or after a Bean is stored. 
Methods in the model will be called when they exist. 

BUT: this methods are not called from the current $bean, for this calls a empty bean is created, so you have to use the $arg parameter. 

- preGet [param:array]
- postGet [result:entity]
- preGetById [id:int,param:array]
- postGetById [result:entity]
- preUpdate [id:int,data:object,pre:entity]
- postUpdate [result:entity]
- preDelete [id:int,pre:entity]
- postDelete [result:entity]
- preCreate [data:object,pre:entity]
- postCreate [result:entity]