FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["SabakaMail.API/SabakaMail.API.csproj", "SabakaMail.API/"]
COPY ["SabakaMail.Infrastructure/SabakaMail.Infrastructure.csproj", "SabakaMail.Infrastructure/"]
COPY ["SabakaMail.Domain/SabakaMail.Domain.csproj", "SabakaMail.Domain/"]

RUN dotnet restore "SabakaMail.API/SabakaMail.API.csproj"

COPY . .

RUN dotnet publish "SabakaMail.API/SabakaMail.API.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SabakaMail.API.dll"]
