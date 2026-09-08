using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SmartHealthcare.API.DTOs;
using SmartHealthcare.API.Models;
using SmartHealthcare.API.Services;

namespace SmartHealthcare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PredictionController : ControllerBase
{
    private readonly MlPredictionService _mlService;
    private readonly MongoDbService _mongoDbService;

    public PredictionController(
        MlPredictionService mlService,
        MongoDbService mongoDbService)
    {
        _mlService = mlService;
        _mongoDbService = mongoDbService;
    }

    [HttpPost]
    public async Task<IActionResult> Predict(
        [FromBody] PredictionRequest request)
    {
        try
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var userEmail =
                User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "User identity not found."
                });
            }

            var data = new Dictionary<string, object>
            {
                ["age"] = request.Age,
                ["sex"] = request.Sex,
                ["cp"] = request.Cp,
                ["trestbps"] = request.Trestbps,
                ["chol"] = request.Chol,
                ["fbs"] = request.Fbs,
                ["restecg"] = request.Restecg,
                ["thalach"] = request.Thalach,
                ["exang"] = request.Exang,
                ["oldpeak"] = request.Oldpeak,
                ["slope"] = request.Slope,
                ["ca"] = request.Ca,
                ["thal"] = request.Thal
            };

            // Call Python ML service
            var result = await _mlService.PredictAsync(data);

            if (result == null)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "ML service returned no result."
                });
            }

            // Save prediction to MongoDB
            var record = new PredictionRecord
            {
                UserId = userId,
                UserEmail = userEmail ?? "",

                Age = request.Age,
                Sex = request.Sex,
                Cp = request.Cp,
                Trestbps = request.Trestbps,
                Chol = request.Chol,
                Fbs = request.Fbs,
                Restecg = request.Restecg,
                Thalach = request.Thalach,
                Exang = request.Exang,
                Oldpeak = request.Oldpeak,
                Slope = request.Slope,
                Ca = request.Ca,
                Thal = request.Thal,

                Prediction = result.Prediction,
                RiskPercentage = result.RiskPercentage,
                RiskLevel = result.RiskLevel,
                Message = result.Message,

                CreatedAt = DateTime.UtcNow
            };

            await _mongoDbService.Predictions.InsertOneAsync(record);

            return Ok(new
            {
                success = true,
                message = "Prediction generated and saved successfully.",
                prediction = result
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Unable to generate prediction.",
                error = ex.Message
            });
        }
    }

    // Get logged-in user's prediction history
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        try
        {
            var userId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var history = await _mongoDbService.Predictions
                .Find(x => x.UserId == userId)
                .SortByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(new
            {
                success = true,
                count = history.Count,
                predictions = history
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Unable to load prediction history.",
                error = ex.Message
            });
        }
    }
}