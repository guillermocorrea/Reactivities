# Build
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as build-image
WORKDIR /home/app

COPY ./*.sln ./
COPY ./*/*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ./${file%.*}/ && mv $file ./${file%.*}/; done
#COPY ./client-app/ ./client-app/

RUN dotnet restore

COPY . .

RUN dotnet test

RUN dotnet publish ./API/API.csproj -o /publish/

# Run
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /publish
COPY --from=build-image /publish .
ENV ASPNETCORE_URLS="http://0.0.0.0:5000"
ENV ASPNETCORE_ENVIRONMENT="Develop"
ENTRYPOINT ["dotnet", "API.dll"]