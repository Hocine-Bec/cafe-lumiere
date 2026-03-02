# ── Stage 1: Build ─────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first to leverage Docker layer caching on restore
COPY backend/Domain/Domain.csproj             backend/Domain/
COPY backend/Application/Application.csproj   backend/Application/
COPY backend/Infrastructure/Infrastructure.csproj backend/Infrastructure/
COPY backend/Presentation/Presentation.csproj backend/Presentation/

RUN dotnet restore backend/Presentation/Presentation.csproj

# Copy remaining source and publish
COPY backend/ backend/

RUN dotnet publish backend/Presentation/Presentation.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Stage 2: Runtime ───────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

# Railway injects $PORT at runtime; fall back to 8080 for local Docker runs
CMD ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet Presentation.dll
