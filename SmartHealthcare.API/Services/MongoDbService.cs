using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SmartHealthcare.API.Models;
using SmartHealthcare.API.Settings;

namespace SmartHealthcare.API.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);

        _database = client.GetDatabase(
            settings.Value.DatabaseName
        );
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("Users");

    public IMongoCollection<PredictionRecord> Predictions =>
        _database.GetCollection<PredictionRecord>("Predictions");
}