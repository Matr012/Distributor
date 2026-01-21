using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CardTypeController : ControllerBase
    {
        private readonly MmzContext _context;
        public CardTypeController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("CardTypes")]
        public IActionResult GetCard_Types()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<CardType> cardTypes = context.CardTypes.ToList();
                    return Ok(cardTypes);
                }
                catch (Exception ex)
                {
                    List<CardType> valasz = new()
                    {
                        new CardType { Id = -1,
                                   CardName = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

    }
}