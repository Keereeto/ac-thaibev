using backend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        { 
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddScoped<ProductService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// ABCD1EFGH2IJKL3MNOP4QRST5UVWX6
app.UseHttpsRedirection();
app.UseCors("AllowAngular");

string connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new Exception("Connection string not found.");

app.MapProductEndpoints(connectionString);

app.Run();