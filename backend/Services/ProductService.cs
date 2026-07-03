using backend.Models;
using Npgsql;

namespace backend.Endpoints;

public class ProductService
{
    private readonly string _connectionString;

    public ProductService(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new Exception("Connection string not found.");
    }

    public async Task<object?> CreateProduct(string productId)
    {
        await using var connection = new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        string sql = """
            INSERT INTO "ac-app".products (product_id)
            VALUES (@productId)
            RETURNING id, product_id;
            """;

        try
        {
            await using var command = new NpgsqlCommand(sql, connection);

            command.Parameters.AddWithValue("productId", productId);

            await using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return Results.Ok(new Product
                {
                    Id = reader.GetInt32(0),
                    ProductId = reader.GetString(1)
                });
            }

            return Results.BadRequest();
        }
        catch (PostgresException ex)
        {
            return Results.Problem(
                detail: ex.Message,
                statusCode: 400
            );
        }
        catch (Exception)
        {
            return Results.Problem(
                detail: "Internal server error",
                statusCode: 500
            );
        }
    }

    public async Task<object?> GetTotalCount()
    {
        await using var connection = new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        string sql = """ 
        SELECT count(product_id) as total
        FROM "ac-app".products;
        """;

        await using var command = new NpgsqlCommand(sql, connection);

        await using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return Results.Ok(new
            {
                Total = reader.GetInt32(0)
            });
        }

        return Results.BadRequest();
    }

    public async Task<object?> GetProducts(int pageNumber)
    {
        await using var connection = new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        string sql = """ 
        SELECT id, product_id
        FROM "ac-app".products
        ORDER BY id
        LIMIT 10 OFFSET @offset;
        """;

        await using var command = new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("offset", (pageNumber - 1) * 10);

        await using var reader = await command.ExecuteReaderAsync();

        var products = new List<Product>();

        while (await reader.ReadAsync())
        {
            products.Add(new Product
            {
                Id = reader.GetInt32(0),
                ProductId = reader.GetString(1)
            });
        }

        return Results.Ok(products);
    }

    public async Task<object?> DeleteProduct(string productId)
    {
        await using var connection = new NpgsqlConnection(_connectionString);

        await connection.OpenAsync();

        string sql = """
            DELETE FROM "ac-app".products
            WHERE product_id = @productId
            """;

        await using var command = new NpgsqlCommand(sql, connection);

        command.Parameters.AddWithValue("productId", productId);

        int rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0)
        {
            return Results.NotFound();
        }

        return Results.Ok();
    }
}
