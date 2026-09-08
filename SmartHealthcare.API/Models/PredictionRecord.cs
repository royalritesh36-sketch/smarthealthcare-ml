using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartHealthcare.API.Models;

public class PredictionRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

    public string UserEmail { get; set; } = string.Empty;

    public int Age { get; set; }
    public int Sex { get; set; }
    public int Cp { get; set; }
    public int Trestbps { get; set; }
    public int Chol { get; set; }
    public int Fbs { get; set; }
    public int Restecg { get; set; }
    public int Thalach { get; set; }
    public int Exang { get; set; }
    public double Oldpeak { get; set; }
    public int Slope { get; set; }
    public int Ca { get; set; }
    public int Thal { get; set; }

    public int Prediction { get; set; }
    public double RiskPercentage { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}