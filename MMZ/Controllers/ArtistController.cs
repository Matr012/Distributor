using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
   
    public class ArtistController : ControllerBase
    {
        private readonly MmzContext _context;
        public ArtistController(MmzContext context) 
        {
            _context = context; 
        }
        [HttpGet("Artists")]
        public IActionResult GetArtists()
        {
            {
                try
                {
                    List<Artist> artists = _context.Artists.ToList();
                    return Ok(artists);
                }
                catch (Exception ex)
                {
                    List<Artist> valasz = new()
                    {
                        new Artist { Id = -1,
                                   Name = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("ArtistById")]
        public IActionResult GetArtistById(int id)
        {
            {
                try
                {
                    Artist eredmeny = _context.Artists.FirstOrDefault(ar => ar.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        Artist valasz = new Artist
                        {
                            Id = -1,
                            Name = "Hiba történt: nincs ilyen azonosítójú zenész!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    Artist valasz = new Artist
                    {
                        Id = -1,
                        Name = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }
        [Authorize]
        [HttpPost("NewArtist")]
        public IActionResult PostArtist(Artist artist)
        {
            {
                try
                {
                    var newArtist = new Artist
                    {
                        Name = artist.Name,
                        Description = artist.Description,
                        SpotifyUrl = artist.SpotifyUrl,
                        SoundcloudUrl = artist.SoundcloudUrl,
                        OtherSocials = artist.OtherSocials,
                        Avatar = artist.Avatar,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    };
                    _context.Artists.Add(newArtist);
                    _context.SaveChanges();
                    return Ok(newArtist.Id.ToString());
                }
                catch (Exception ex)
                {
                    var msg = ex.InnerException?.Message ?? ex.Message;
                    return BadRequest($"Hiba a rögzítés közben {msg}");
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyArist")]
        public IActionResult PutArtist(Artist artist)
        {
            {
                try
                {
                    if (_context.Artists.Contains(artist))
                    {
                        _context.Artists.Update(artist);
                        _context.SaveChanges();
                        return Ok("Sikeres rögzítés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen zenész!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a módosítás közben {ex.Message}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("DelArtist")]
        public IActionResult DeleteArtist(int id)
        {
            {
                try
                {
                    if (_context.Artists.Select(ar => ar.Id).Contains(id))
                    {
                        _context.Remove(new Artist { Id = id });
                        _context.SaveChanges();
                        return Ok("Sikeres törlés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen zenész!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a törlés közben {ex.Message}");
                }
            }
        }
    }
}