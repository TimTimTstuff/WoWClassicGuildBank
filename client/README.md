# SPA Client

## Structure
- Folder are separated by component and dependencies
- each numbered folder is a own ts project / generated js file
- numbering is to order the folder easier

## Current Structure
- 01_base Add all high level and dependency free stuff here. like Configuration, Images / Data. 
- 02_web Web modules which are lose bound / backend or rendering tools
- 03_service All services / WebServiceClient related stuff
- 04_components all HtmlCards and other components which contains "entity based logic"
- ** all the free numbers are free
- 09_app setup of the app.

## building
- you can build the whole app from the base folder with the client.ps1
- you can create a release build with the parameter prod (which also copies stlye/html and img folder into the dist folder)
- the build is pushed in the /dist folder
- you can call the 'tsc' command in each subfolder to only build the specific module. 

