using Microsoft.AspNetCore.Mvc;
using SabakaMail.API.DTOs.Requests;
using SabakaMail.API.DTOs.Responses;
using SabakaMail.Domain.Entities;
using SabakaMail.Domain.Repositories;

namespace SabakaMail.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MailsController(IMailRepository mailRepository, IUserRepository userRepository)
    : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var mail = await mailRepository.GetByIdAsync(id, ct);
        if (mail is null)
            return NotFound();

        return Ok(new MailResponse(mail.Id, mail.Subject, mail.Body, mail.SenderId, mail.RecipientId));
    }

    [HttpGet("inbox/{userId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<MailResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInbox(Guid userId, CancellationToken ct)
    {
        var mails = await mailRepository.GetByRecipientIdAsync(userId, ct);
        var response = mails.Select(m => new MailResponse(m.Id, m.Subject, m.Body, m.SenderId, m.RecipientId));
        return Ok(response);
    }

    [HttpGet("sent/{userId:guid}")]
    [ProducesResponseType(typeof(IReadOnlyList<MailResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSent(Guid userId, CancellationToken ct)
    {
        var mails = await mailRepository.GetBySenderIdAsync(userId, ct);
        var response = mails.Select(m => new MailResponse(m.Id, m.Subject, m.Body, m.SenderId, m.RecipientId));
        return Ok(response);
    }

    [HttpPost("send/{senderId:guid}")]
    [ProducesResponseType(typeof(MailResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Send(Guid senderId, [FromBody] SendMailRequest request, CancellationToken ct)
    {
        var sender = await userRepository.GetByIdAsync(senderId, ct);
        if (sender is null)
            return NotFound($"Sender {senderId} not found.");

        var recipient = await userRepository.GetByIdAsync(request.RecipientId, ct);
        if (recipient is null)
            return NotFound($"Recipient {request.RecipientId} not found.");

        var mail = new Mail
        {
            Id = Guid.NewGuid(),
            Subject = request.Subject,
            Body = request.Body,
            SenderId = senderId,
            RecipientId = request.RecipientId
        };

        await mailRepository.AddAsync(mail, ct);

        var response = new MailResponse(mail.Id, mail.Subject, mail.Body, mail.SenderId, mail.RecipientId);
        return CreatedAtAction(nameof(GetById), new { id = mail.Id }, response);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var mail = await mailRepository.GetByIdAsync(id, ct);
        if (mail is null)
            return NotFound();

        await mailRepository.DeleteAsync(id, ct);
        return NoContent();
    }
}
