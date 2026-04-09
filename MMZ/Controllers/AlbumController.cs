using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class AlbumController : ControllerBase
    {
        private readonly MmzContext _context;
        public AlbumController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("Albums")]
        public IActionResult GetAlbums()
        {
                try
                {
                    List<Album> albums = _context.Albums.ToList();
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

        [HttpGet("AlbumById")]
        public IActionResult GetAlbumById(int id)
        {
            
                try
                {
                    Album eredmeny = _context.Albums.FirstOrDefault(ab => ab.Id == id);
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
        [Authorize]
        [HttpPost("NewAlbum")]
        public IActionResult PostAlbum(Album album)
        {
            {
                try
                {
                    var newAlbum = new Album
                    {
                        UserId = album.UserId,
                        ArtistId = album.ArtistId,
                        EanUpc = album.EanUpc,
                        CodeRequest = album.CodeRequest,
                        Title = album.Title,
                        Subtitle = album.Subtitle,
                        OriginalReleaseDate = album.OriginalReleaseDate,
                        DigitalReleaseDate = album.DigitalReleaseDate,
                        Redistribution = album.Redistribution,
                        SpotifyArtistUrl = album.SpotifyArtistUrl,
                        AppleArtistUrl = album.AppleArtistUrl,
                        CoverPath = album.CoverPath,
                        Status = album.Status,
                        StyleId = album.StyleId > 0 ? album.StyleId : null,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    };
                    _context.Albums.Add(newAlbum);
                    _context.SaveChanges();
                    return Ok(newAlbum.Id.ToString());
                }
                catch (Exception ex)
                {
                    var msg = ex.InnerException?.Message ?? ex.Message;
                    return BadRequest($"Hiba a rögzítés közben {msg}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyAlbum")]
        public IActionResult PutAlbum(Album album)
        {
            {
                try
                {
                    if (_context.Albums.Contains(album))
                    {
                        _context.Albums.Update(album);
                        _context.SaveChanges();
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
        [Authorize(Roles = "Admin")]
        [HttpPatch("UpdateStatus")]
        public IActionResult UpdateStatus(int id, string status)
        {
            {
                try
                {
                    var album = _context.Albums.FirstOrDefault(a => a.Id == id);
                    if (album == null)
                        return NotFound("Nincs ilyen album!");

                    album.Status = status;
                    album.UpdatedAt = DateTime.UtcNow;
                    _context.SaveChanges();
                    return Ok("Státusz frissítve.");
                }
                catch (Exception ex)
                {
                    var msg = ex.InnerException?.Message ?? ex.Message;
                    return BadRequest($"Hiba a státusz frissítés közben: {msg}");
                }
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DelAlbum")]
        public IActionResult DeleteAlbum(int id)
        {
            {
                try
                {
                    if (_context.Albums.Select(ab => ab.Id).Contains(id))
                    {
                        _context.Remove(new Album { Id = id });
                        _context.SaveChanges();
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