using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using SmartHealthcare.API.Services;
using SmartHealthcare.API.Settings;


var builder = WebApplication.CreateBuilder(args);


// ==========================================
// Controllers
// ==========================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


// ==========================================
// MongoDB
// ==========================================

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDB")
);

builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddHttpClient<MlPredictionService>();


// ==========================================
// JWT Authentication
// ==========================================

var jwtSettings =
    builder.Configuration
        .GetSection("Jwt")
        .Get<JwtSettings>();


if (jwtSettings == null ||
    string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException(
        "JWT configuration is missing."
    );
}


builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,

                ValidateAudience = true,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,

                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.Key
                        )
                    )
            };
    });


builder.Services.AddAuthorization();


// ==========================================
// CORS
// ==========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontendPolicy",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


var app = builder.Build();


// ==========================================
// Swagger
// ==========================================

app.UseSwagger();
app.UseSwaggerUI();

// ==========================================
// Middleware
// ==========================================

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();


app.Run();