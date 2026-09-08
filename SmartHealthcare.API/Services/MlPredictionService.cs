using System.Net.Http.Json;

namespace SmartHealthcare.API.Services;

public class MlPredictionService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public MlPredictionService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<MlPredictionResponse?> PredictAsync(
        Dictionary<string, object> data)
    {
        var baseUrl = _configuration["MLService:BaseUrl"];

        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            throw new Exception("ML service URL is not configured.");
        }

        var response = await _httpClient.PostAsJsonAsync(
            $"{baseUrl}/predict",
            data
        );

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();

            throw new Exception(
                $"ML service returned {response.StatusCode}: {error}"
            );
        }

        return await response.Content
            .ReadFromJsonAsync<MlPredictionResponse>();
    }
}

public class MlPredictionResponse
{
    public bool Success { get; set; }
    public int Prediction { get; set; }
    public double RiskPercentage { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Disclaimer { get; set; } = string.Empty;
}