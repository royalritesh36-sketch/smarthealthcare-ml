using Microsoft.AspNetCore.Mvc;
using SmartHealthcare.API.Services;

namespace SmartHealthcare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public HealthController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            success = true,
            message = "SmartHealthcare API is running",
            database = "MongoDB configured",
            timestamp = DateTime.UtcNow
        });
    }
}