Write-Host "Start Build"
$folder = "01_base","02_web","03_services";
$tsFilesFolder = "client";
$location = Get-Location
$baseFolder = $loaction.Path;
$styleFolder = "$($location.Path)\dist\style\"
foreach ($item in $folder) {
     
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