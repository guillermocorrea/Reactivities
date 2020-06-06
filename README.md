# Reactivities

<https://reactivities-app.azurewebsites.net/>

## Configuration

Set the following appsettings keys:

```
TokenKey = ****
Cloudinary:CloudName = ****
Cloudinary:ApiSecret = ****
Cloudinary:ApiKey = ****
Authentication:Facebook:AppSecret = your-fb-app-secret
Authentication:Facebook:AppId = your-fb-app-id
```

## Publish

`dotnet publish -c Release -o publish --self-contained false Reactivities.sln`

## Build Docker image

`docker build -t guillermocorrea/reactivities:latest .`

## Run Docker image

`docker run -it -p 8080:5000 guillermocorrea/reactivities:latest -e TokenKey='super secret token key goes here'`

## Pull docker image from dockerhub

`docker pull guillermocorrea/reactivities`

## Local docker registry

```
cd Tools/Registry
docker-compose up -d
```

Go to <http://localhost:50000/v2/_catalog>

Add the following entry to the `C:/Windows/system32/drivers/etc/hosts` file.

`127.0.0.1 my-registry`

Now you can go to <http://my-registry:50000/v2/_catalog>

## Local CI/CD TeamCity instance

```
cd Tools/TeamCity
docker-compose up -d
```

Go to <http://localhost:8111/>
