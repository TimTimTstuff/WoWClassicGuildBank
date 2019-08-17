<?php 
/**
 * Base Controller for API Calls. ApiController calls this methods
 */
interface ApiBaseCtrl{
    /**
     * Returns the entity name
     *
     * @return void
     */
    function getEntityName();

    /**
     * Sets the Api Controller
     *
     * @param ApiService $context
     * @return void
     */
    function setContext(ApiService $context);

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
     * @param array $data record data 
     * @return object single updated object
     */
    function update($id, $data);

    /**
     * Detelets a Record
     * METHOD: DELETE
     * @param int $id
     * @return void
     */
    function delete($id);

    /**
     * Creates a record
     * METHOD: POST
     * @param array $data
     * @return object Created Object
     */
    function create($data);

    /**
     * Invokes an action in the model class
     *
     * @param string $action
     * @param integer $id
     * @param object $data
     * @return object action result
     * 
     * 
     */
    function invokeAction(string $action, int $id, $data);
    
}