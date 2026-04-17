using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;
using MMZ.DTOs;

namespace MMZ.Controllers
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
                    Album eredmeny = context.Albums.FirstOrDefault(ab => ab.Id == id);
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

        [Authorize]
        [HttpPost("NewAlbum")]
        public IActionResult PostAlbum(AlbumDTO albumDto)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    var album = new Album
                    {
                        UserId = albumDto.UserId,
                        ArtistId = albumDto.ArtistId,
                        EanUpc = albumDto.EanUpc,
                        CodeRequest = albumDto.CodeRequest,
                        Title = albumDto.Title,
                        Subtitle = albumDto.Subtitle,
                        OriginalReleaseDate = albumDto.OriginalReleaseDate,
                        DigitalReleaseDate = albumDto.DigitalReleaseDate,
                        Redistribution = albumDto.Redistribution,
                        SpotifyArtistUrl = albumDto.SpotifyArtistUrl,
                        AppleArtistUrl = albumDto.AppleArtistUrl,
                        Status = albumDto.Status,
                        StyleId = albumDto.StyleId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    if (!string.IsNullOrEmpty(albumDto.CoverPath))
                    {
                        album.CoverPath = Convert.FromBase64String(albumDto.CoverPath);
                    }

                    context.Albums.Add(album);
                    context.SaveChanges();
                    return Ok(album.Id.ToString());
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateStatus")]
        public IActionResult UpdateStatus(int id, string status)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    var album = context.Albums.FirstOrDefault(a => a.Id == id);
                    if (album == null)
                        return NotFound("Nincs ilyen album!");

                    album.Status = status;
                    album.UpdatedAt = DateTime.UtcNow;
                    context.SaveChanges();
                    return Ok("Album státusz frissítve: " + status);
                }
                catch (Exception ex)
                {
                    return BadRequest("Hiba: " + ex.Message);
                }
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DelAlbum")]
        public IActionResult DeleteAlbum(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Albums.Select(ab => ab.Id).Contains(id))
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