# Reactivities

<https://reactivities-app.azurewebsites.net/>

## Configuration

Set the following appsettings keys:

```
TokenKey = ****
Cloudinary:CloudName = ****
Cloudinary:ApiSecret = ****
Cloudinary:ApiKey = ****
```

## Publish

`dotnet publish -c Release -o publish --self-contained false Reactivities.sln`
