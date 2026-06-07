namespace SabakaMail.API.DTOs.Requests;

public record SendMailRequest(string Subject, string Body, Guid RecipientId);
