using Microsoft.EntityFrameworkCore;
using SabakaMail.Domain.Entities;
using SabakaMail.Domain.Repositories;
using SabakaMail.Infrastructure.Data;

namespace SabakaMail.Infrastructure.Repositories;

public class MailRepository : IMailRepository
{
    private readonly AppDbContext _context;

    public MailRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Mail?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _context.Mails.AsNoTracking().FirstOrDefaultAsync(m => m.Id == id, ct);

    public async Task<IReadOnlyList<Mail>> GetBySenderIdAsync(Guid senderId, CancellationToken ct = default)
        => await _context.Mails
            .AsNoTracking()
            .Where(m => m.SenderId == senderId)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Mail>> GetByRecipientIdAsync(Guid recipientId, CancellationToken ct = default)
        => await _context.Mails
            .AsNoTracking()
            .Where(m => m.RecipientId == recipientId)
            .ToListAsync(ct);

    public async Task AddAsync(Mail mail, CancellationToken ct = default)
    {
        await _context.Mails.AddAsync(mail, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var mail = await _context.Mails.FindAsync([id], ct);
        if (mail is not null)
        {
            _context.Mails.Remove(mail);
            await _context.SaveChangesAsync(ct);
        }
    }
}