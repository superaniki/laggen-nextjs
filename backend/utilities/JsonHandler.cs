using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;


namespace SuperAniki.Laggen.Utilities
{

  public class JsonResult<T>
  {
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? ErrorMessage { get; set; }
  }

  public static class JsonHandler
  {
    public static JsonResult<T> ExtractJsonData<T>(string jsonData, ILogger logger)
    {
      try
      {
        T? data = JsonConvert.DeserializeObject<T>(jsonData);
        if (data == null)
        {
          logger.LogError("Deserialization returned null.");
          return new JsonResult<T> { Success = false, ErrorMessage = "Deserialization returned null." };
        }
        return new JsonResult<T> { Success = true, Data = data };
      }
      catch (JsonException ex)
      {
        logger.LogError($"JSON parsing error: {ex.Message}");
        return new JsonResult<T> { Success = false, ErrorMessage = "Invalid JSON data." };
      }
      catch (Exception ex)
      {
        logger.LogError($"Unexpected error: {ex.Message}");
        return new JsonResult<T> { Success = false, ErrorMessage = "An unexpected error occurred." };
      }
    }
  }
}