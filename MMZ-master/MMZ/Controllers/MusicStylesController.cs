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
                    List<MusicStyle> musicStyles = context.MusicStyles.ToList();
                    return Ok(musicStyles);
                }
                catch (Exception ex)
                {
                    List<MusicStyle> valasz = new()
                    {
                        new MusicStyle { Id = -1,
                                   GenreName = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

    }
}