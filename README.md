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

`docker build -t reactivities:latest .`

## Run Docker image

`docker run -it -p 8080:5000 reactivities:latest -e TokenKey='super secret token key goes here'`
