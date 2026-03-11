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
        [HttpGet("Artists")]
        public IActionResult GetArtists()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<Artist> artists = context.Artists.ToList();
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
            using (var context = new MmzContext())
            {
                try
                {
                    Artist eredmeny = context.Artists.FirstOrDefault(ar => ar.Id == id);
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
        [Authorize(Roles = "Admin")]
        [HttpPost("NewArtist")]
        public IActionResult PostArtist(Artist artist)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.Artists.Add(artist);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyArist")]
        public IActionResult PutArtist(Artist artist)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Artists.Contains(artist))
                    {
                        context.Artists.Update(artist);
                        context.SaveChanges();
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
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Artists.Select(ar => ar.Id).Contains(id))
                    {
                        context.Remove(new Artist { Id = id });
                        context.SaveChanges();
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