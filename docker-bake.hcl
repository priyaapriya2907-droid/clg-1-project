group "default" {
  targets = ["app"]
}

target "app" {
  dockerfile = "Dockerfile"
  context    = "."
  platforms  = ["linux/amd64", "linux/arm64"]
  
  tags = [
    "docker.io/${DOCKER_USERNAME}/clg-1-project:latest",
    "docker.io/${DOCKER_USERNAME}/clg-1-project:${BUILD_DATE}"
  ]
}
