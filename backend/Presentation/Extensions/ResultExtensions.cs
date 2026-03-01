using Application.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Extensions;

public static class ResultExtensions
{
    public static ActionResult HandleResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
            return new OkObjectResult(result.Value);

        return MapErrorToResponse(result.Error, result.ErrorType);
    }

    public static ActionResult HandleResult(this Result result)
    {
        if (result.IsSuccess)
            return new NoContentResult();

        return MapErrorToResponse(result.Error, result.ErrorType);
    }

    public static ActionResult HandleCreatedResult<T>(
        this Result<T> result,
        string actionName,
        string controllerName,
        object routeValues)
    {
        if (result.IsSuccess)
            return new CreatedAtActionResult(actionName, controllerName, routeValues, result.Value);

        return MapErrorToResponse(result.Error, result.ErrorType);
    }

    private static ActionResult MapErrorToResponse(string error, ErrorType errorType)
    {
        var problemDetails = new ProblemDetails { Detail = error };

        return errorType switch
        {
            ErrorType.BadRequest => new BadRequestObjectResult(problemDetails),
            ErrorType.NotFound => new NotFoundObjectResult(problemDetails),
            ErrorType.Unauthorized => new UnauthorizedObjectResult(problemDetails),
            ErrorType.Forbidden => new ObjectResult(problemDetails) { StatusCode = 403 },
            ErrorType.Conflict => new ConflictObjectResult(problemDetails),
            ErrorType.InternalServerError => new ObjectResult(problemDetails) { StatusCode = 500 },
            _ => new ObjectResult(problemDetails) { StatusCode = 500 }
        };
    }
}
