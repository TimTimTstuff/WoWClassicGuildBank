### configuration ###

#build included folders
$folder = 
          "01_base",
          "02_web",
          "03_services",
          "04_components",
          "09_app";

#build type (tsconfig file)
$defaultBuild = ".dev";    
#folder with style files   
$styleFolder = "..\dist\style\";
$imgFolder = "..\dist\";




## Build Script 
Write-Host "Start Build"
$build = "";
if($null -ne $args[0]){
     $build = ".$($args[0])";
}
$location = Get-Location;

foreach ($item in $folder) {
     
      #prepare folder
      $buildFolder = "$($location.Path)\$($item)" 
      

      $localStyleFolder = "$($location.Path)\$($item)\style"
      $localImgFolder = "$($location.Path)\$($item)\img";      

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

     #copy img files if they exist
     if(Test-Path $localImgFolder){
          
          Write-Host "Has Img Path"
          Copy-Item "$($localImgFolder)\" -Destination $imgFolder -Container -Recurse -Force 
     }

      #copy main html
      if(Test-Path "$($location.Path)/$($item)/main.html"){
          Write-Host "Has main html"
          Copy-Item "$($location.Path)/$($item)/main.html" -Destination "..\dist\index.html"  -Recurse 
     }

     #revert tsconfig changes
     if("" -ne $build){
          Copy-Item "$($item)\tsconfig$($defaultBuild).json" -Destination "$($item)\tsconfig.json"
     }
}
Write-Host "Finish Build"