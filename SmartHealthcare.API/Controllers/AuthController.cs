using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using MongoDB.Driver;

using SmartHealthcare.API.DTOs;
using SmartHealthcare.API.Models;
using SmartHealthcare.API.Services;
using SmartHealthcare.API.Settings;

namespace SmartHealthcare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly IConfiguration _configuration;

    public AuthController(
        MongoDbService mongoDbService,
        IConfiguration configuration)
    {
        _mongoDbService = mongoDbService;
        _configuration = configuration;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        // Check if email already exists
        var existingUser = await _mongoDbService.Users
            .Find(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (existingUser != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Email is already registered."
            });
        }

        // Hash password
        var passwordHash =
            BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create user
        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email,
            PasswordHash = passwordHash,
            Role = "Patient",
            CreatedAt = DateTime.UtcNow
        };

        // Save user to MongoDB
        await _mongoDbService.Users.InsertOneAsync(user);

        return Ok(new
        {
            success = true,
            message = "Registration successful.",
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            }
        });
    }

    // ==========================================
    // LOGIN
    // ==========================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        // Find user
        var user = await _mongoDbService.Users
            .Find(u => u.Email == email)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        // Verify password
        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        // Generate JWT
        var token = GenerateJwtToken(user);

        return Ok(new
        {
            success = true,
            message = "Login successful.",
            token = token,
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            }
        });
    }

    // ==========================================
    // GENERATE JWT TOKEN
    // ==========================================

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration
            .GetSection("Jwt")
            .Get<JwtSettings>();

        if (jwtSettings == null ||
            string.IsNullOrWhiteSpace(jwtSettings.Key))
        {
            throw new InvalidOperationException(
                "JWT configuration is missing."
            );
        }

        // JWT claims
        var claims = new List<Claim>
        {
            // User ID
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id
            ),

            // User name
            new Claim(
                ClaimTypes.Name,
                user.Name
            ),

            // User email
            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            // User role
            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        // Secret key
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings.Key)
        );

        // Signing credentials
        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        // Create JWT
        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                jwtSettings.ExpiryMinutes
            ),
            signingCredentials: credentials
        );

        // Convert JWT to string
        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}