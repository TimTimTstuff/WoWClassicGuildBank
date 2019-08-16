<?php 

interface ApiBaseCtrl{
    /**
     * Returns the entity name
     *
     * @return void
     */
    function getEntityName();

    function setContext(ApiController $context);

    /**
     * Get Records
     * Method: GET
     *
     * @param array $param url parameters
     * @return array array of entity
     */
    function get($param);

    /**
     * Get specific record by Id
     * Method: GET
     * @param int $get record id
     * @param array $param url params
     * @return object single object 
     */
    function getById($id,$param);
    /**
     * Update a specific record
     * Method: PUT
     * @param int $id record id
     * @param object $data record data 
     * @return void
     */
    function update($id, $data);

    /**
     * Undocumented function
     *
     * @param [type] $id
     * @return void
     */
    function delete($id);

    function create($data);

    function invokeAction(string $action, int $id, $data);
    
}