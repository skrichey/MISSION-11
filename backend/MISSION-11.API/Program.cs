using Microsoft.EntityFrameworkCore;
using MISSION_11.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS with a specific policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")  // Allow only this origin (frontend)
               .AllowAnyMethod()  // Allow all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader(); // Allow all headers
    });
});

// Add services to the container.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=Bookstore.sqlite"));

// Add controllers and other services
builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use the correct CORS policy
app.UseCors(x => x.WithOrigins("http://localhost:3000"));  // Apply the CORS policy for React frontend

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
