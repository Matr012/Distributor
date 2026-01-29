using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        [HttpGet("Albums")]
        public IActionResult GetAlbums()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<Album> albums = context.Albums.ToList();
                    return Ok(albums);
                }
                catch (Exception ex)
                {
                    List<Album> valasz = new()
                    {
                        new Album { Id = -1,
                                   Title = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("AlbumById")]
        public IActionResult GetAlbumById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    Album eredmeny = context.Albums.FirstOrDefault(x => x.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        Album valasz = new Album
                        {
                            Id = -1,
                            Title = "Hiba történt: nincs ilyen azonosítójú album!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    Album valasz = new Album
                    {
                        Id = -1,
                        Title = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpPost("NewAlbum")]
        public IActionResult PostAlbum(Album album)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.Albums.Add(album);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

        [HttpPut("ModifyAlbum")]
        public IActionResult PutAlbum(Album album)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Albums.Contains(album))
                    {
                        context.Albums.Update(album);
                        context.SaveChanges();
                        return Ok("Sikeres rögzítés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen Album!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a módosítás közben {ex.Message}");
                }
            }
        }

        [HttpDelete("DelAlbum")]
        public IActionResult DeleteAlbum(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Albums.Select(a => a.Id).Contains(id))
                    {
                        context.Remove(new Album { Id = id });
                        context.SaveChanges();
                        return Ok("Sikeres törlés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen Album!");
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