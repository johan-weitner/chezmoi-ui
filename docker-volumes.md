To ensure that the work you do in a dockerized application is persisted between sessions, you should use Docker volumes. Docker volumes allow you to store data outside the container's filesystem, so that data remains intact even if the container is stopped or removed.

Here is a basic example of how to use a Docker volume:

1. Create a Docker volume if you haven't already:
   docker volume create my_volume
   sh
2. When running your Docker container, mount the volume to a directory inside the container:
   docker run -v my_volume:/path/inside/container my_image
   sh
   Replace `my_volume` with the name of your volume, `/path/inside/container` with the path inside the container where you want to persist data, and `my_image` with the name of your Docker image.

This way, any data written to `/path/inside/container` inside the container will be stored in `my_volume`, and will persist between sessions.