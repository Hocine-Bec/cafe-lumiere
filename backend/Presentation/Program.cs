using System.Text;
using Application.Extensions;
using DotNetEnv;
using Infrastructure.Data;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ──────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("DEFAULTCONNECTION")));

// Application layer (Mapster, FluentValidation, Services)
builder.Services.AddApplicationServices();

// Infrastructure layer (UnitOfWork, AuthService)
builder.Services.AddInfrastructureServices(builder.Configuration);

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
        ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY")!)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// CORS — allow React frontend
var allowedOrigins = new List<string> { "http://localhost:5173", "http://localhost:3000" };
var corsOrigin = Environment.GetEnvironmentVariable("CORS_ORIGIN");
if (!string.IsNullOrWhiteSpace(corsOrigin))
    allowedOrigins.Add(corsOrigin);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// OpenAPI + Scalar
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, ct) =>
    {
        document.Info = new()
        {
            Title = "Café Lumière API",
            Version = "v1",
            Description = "Restaurant & Café Management API — Menu, Reservations, Contact, Admin Panel"
        };
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// ── Seed database ──────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DataSeeder.SeedAsync(db);
}

// ──────────────────────────────────────────────
// MIDDLEWARE PIPELINE
// ──────────────────────────────────────────────

// OpenAPI JSON endpoint + Scalar UI
app.MapOpenApi();
app.MapScalarApiReference("/scalar/", options =>
{
    options.Title = "Café Lumière API";
    options.AddPreferredSecuritySchemes("Bearer");
    options.AddHttpAuthentication("Bearer", _ => { });
});

// CORS must come before auth
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
