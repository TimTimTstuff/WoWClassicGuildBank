Write-Host "Start Build"
$build = "";
if($null -ne $args[0]){
     $build = ".$($args[0])";
}
$folder = "01_base",
          "02_web",
          "03_services",
          "09_app";
          
$tsFilesFolder = "client";
$location = Get-Location
 $tsFilesFolder;
$styleFolder = "$($location.Path)\dist\style\"
foreach ($item in $folder) {
     
     
          Copy-Item "$($item)\tsconfig$($build).json" -Destination "$($item)\tsconfig.json"
     $buildFolder = "$($location.Path)\${$tsFilesFolder}\$($item)" 
     $localStyleFolder = "$($buildFolder)\style"
     
     Write-Host "Build $($item)"
     tsc -p $buildFolder 

     if(Test-Path $localStyleFolder){
          Write-Host "Has Style Path"
          Copy-Item "$($localStyleFolder)\*" -Destination $styleFolder -Recurse 
     }

}
Write-Host "Finish Build"