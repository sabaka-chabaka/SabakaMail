using SabakaMail.Domain.Entities;

namespace SabakaMail.Domain.Repositories;

public interface IMailRepository
{
    Task<Mail?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Mail>> GetBySenderIdAsync(Guid senderId, CancellationToken ct = default);
    Task<IReadOnlyList<Mail>> GetByRecipientIdAsync(Guid recipientId, CancellationToken ct = default);
    Task AddAsync(Mail mail, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
