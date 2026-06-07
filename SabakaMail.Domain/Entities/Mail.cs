namespace SabakaMail.Domain.Entities;

public class Mail
{
    public Guid Id { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
}