using System.ComponentModel.DataAnnotations;

namespace SmartHealthcare.API.DTOs;

public class PredictionRequest
{
    [Range(1, 120)]
    public int Age { get; set; }

    [Range(0, 1)]
    public int Sex { get; set; }

    [Range(0, 3)]
    public int Cp { get; set; }

    [Range(50, 250)]
    public int Trestbps { get; set; }

    [Range(50, 600)]
    public int Chol { get; set; }

    [Range(0, 1)]
    public int Fbs { get; set; }

    [Range(0, 2)]
    public int Restecg { get; set; }

    [Range(50, 250)]
    public int Thalach { get; set; }

    [Range(0, 1)]
    public int Exang { get; set; }

    [Range(0, 10)]
    public double Oldpeak { get; set; }

    [Range(0, 2)]
    public int Slope { get; set; }

    [Range(0, 4)]
    public int Ca { get; set; }

    [Range(0, 3)]
    public int Thal { get; set; }
}