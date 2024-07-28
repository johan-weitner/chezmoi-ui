# Check if Docker is running
$dockerStatus = & docker info 2>&1
if ($dockerStatus -match "Is the docker daemon running?") {
	Write-Output "Docker is not running. Starting Docker..."
  Start-Service Docker
}

# Check if the Docker images are built
$images = & docker images
if ($images -notmatch 'chezmoi-ui') {
	Write-Output "Docker images not found. Running docker-compose up --build..."
	& docker-compose up --build
} else {
	& docker-compose up
}