using System.Text.RegularExpressions;
using Npgsql;

namespace backend.Endpoints;

public static class ProductEndpoints
{
    private const string ProductIdPattern = "^[A-Z0-9]{30}$";
    public static void MapProductEndpoints(
        this WebApplication app,
        string connectionString)
    {
        
        app.MapPost("/products/{productId}", async (
            string productId,
            ProductService productService
        ) =>
        {
            if (!Regex.IsMatch(productId, ProductIdPattern))
            {
                return Results.BadRequest(new
                {
                    Message = "Invalid product ID format."
                });
            }

            var result = await productService.CreateProduct(productId);

            return result;
        })
        .WithName("CreateProduct")
        .WithOpenApi();

        app.MapGet("/products/count", async (ProductService productService) =>
        {
            var result = await productService.GetTotalCount();

            return result;
        })
        .WithName("TotalProducts")
        .WithOpenApi();

        app.MapGet("/products/page/{pageNumber}", async (
            int pageNumber,
            ProductService productService
        ) =>
        {
            if (pageNumber < 1)
            {
                return Results.BadRequest("Page number must be greater than 0.");
            }

            var result = await productService.GetProducts(pageNumber);

            return result;
        })
        .WithName("GetProducts")
        .WithOpenApi();

        app.MapDelete("/products/{productId}", async (
            string productId,
            ProductService productService
        ) =>
        {
            if (!Regex.IsMatch(productId, ProductIdPattern))
            {
                return Results.BadRequest(new
                {
                    Message = "Invalid product ID format."
                });
            }
            
            var result = await productService.DeleteProduct(productId);

            return result;
        })
        .WithName("DeleteProduct")
        .WithOpenApi();
    }
}