### configuration ###

#build included folders
$folder = "01_base",
          "02_web",
          "03_services",
          "09_app";

#build type (tsconfig file)
$defaultBuild = ".dev";    
#folder with style files   
$styleFolder = "dist\style\"




## Build Script 
Write-Host "Start Build"
$build = "";
if($null -ne $args[0]){
     $build = ".$($args[0])";
}
$location = Get-Location;
$styleFolder = "$($location.Path)\$($styleFolder)";
foreach ($item in $folder) {
     
      #prepare folder
      $buildFolder = "$($location.Path)\$($item)" 
      

      $localStyleFolder = "$($buildFolder)\style"
      

     #copy tsconfig file
     if("" -ne $build){
          Copy-Item "$($item)\tsconfig$($build).json" -Destination "$($item)\tsconfig.json"
     }

     #tsc build
     Write-Host "Build $($item)"
     tsc -p $buildFolder 

     #copy style files if they exist
     if(Test-Path $localStyleFolder){
          Write-Host "Has Style Path"
          Copy-Item "$($localStyleFolder)\*" -Destination $styleFolder -Recurse 
     }

     #revert tsconfig changes
     if("" -ne $build){
          Copy-Item "$($item)\tsconfig$($defaultBuild).json" -Destination "$($item)\tsconfig.json"
     }
}
Write-Host "Finish Build"