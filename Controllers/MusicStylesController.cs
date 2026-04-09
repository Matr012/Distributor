using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MusicStylesController : ControllerBase
    {
        private readonly MmzContext _context;
        public MusicStylesController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("MusicStyles")]
        public IActionResult GetMusic_Styles()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    var musicStyles = context.MusicStyles
                        .OrderBy(s => s.GenreName)
                        .Select(s => new { s.Id, s.GenreName })
                        .ToList();
                    return Ok(musicStyles);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { error = "Hiba történt: " + ex.Message });
                }
            }
        }

    }
}