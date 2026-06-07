namespace SabakaMail.API.DTOs.Responses;

public record MailResponse(Guid Id, string Subject, string Body, Guid SenderId, Guid RecipientId);
