# TACO Middle-tier

### Local Development Setup

This project was developed using IntelliJ IDEA, but you can use any Java IDE for development.
Just make sure whatever IDE specific files are generated are included in the `.gitignore`.

- After running `build.sh` we need to move the build `.war` file to our Tomcat server, so we run the following command from the middle-tier root:
    - `docker cp dist/taco.war <docker container id>:/usr/local/tomcat/webapps`
- Now the running application should be up to date.

Unfortunately because hot-deploy isn't currently working, you'll have the run the above command after every change you make.
