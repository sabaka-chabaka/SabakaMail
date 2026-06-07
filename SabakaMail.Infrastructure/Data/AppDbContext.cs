using Microsoft.EntityFrameworkCore;
using SabakaMail.Domain.Entities;
using SabakaMail.Infrastructure.Data.Configurations;

namespace SabakaMail.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Mail> Mails => Set<Mail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new MailConfiguration());
    }
}