using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class TrackController : ControllerBase
    {
        private readonly MmzContext _context;
        public TrackController(MmzContext context) 
        { 
            _context = context; 
        }
        [HttpGet("Tracks")]
        public IActionResult GetTracks()
        {
            {
                try
                {
                    List<Track> tracks = _context.Tracks.ToList();
                    return Ok(tracks);
                }
                catch (Exception ex)
                {
                    List<Track> valasz = new()
                    {
                        new Track { Id = -1,
                                   Title = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("TrackById")]
        public IActionResult GetTrackById(int id)
        {
            {
                try
                {
                    Track eredmeny = _context.Tracks.FirstOrDefault(t => t.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        Track valasz = new Track
                        {
                            Id = -1,
                            Title = "Hiba történt: nincs ilyen azonosítójú album!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    Track valasz = new Track
                    {
                        Id = -1,
                        Title = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }
        [Authorize]
        [HttpPost("NewTrack")]
        public IActionResult PostTrack(Track track)
        {
            {
                try
                {
                    var newTrack = new Track
                    {
                        AlbumId = track.AlbumId,
                        TrackNumber = track.TrackNumber,
                        Title = track.Title,
                        Subtitle = track.Subtitle,
                        IsrcRequest = track.IsrcRequest,
                        OriginalReleaseDate = track.OriginalReleaseDate,
                        Collaborators = track.Collaborators,
                        ExplicitLyrics = track.ExplicitLyrics,
                        Composers = track.Composers,
                        Lyricists = track.Lyricists,
                        AudioPath = track.AudioPath,
                        StyleId = track.StyleId > 0 ? track.StyleId : null,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    };
                    _context.Tracks.Add(newTrack);
                    _context.SaveChanges();
                    return Ok(newTrack.Id.ToString());
                }
                catch (Exception ex)
                {
                    var msg = ex.InnerException?.Message ?? ex.Message;
                    return BadRequest($"Hiba a rögzítés közben {msg}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyTrack")]
        public IActionResult PutTrack(Track track)
        {
            {
                try
                {
                    if (_context.Tracks.Contains(track))
                    {
                        _context.Tracks.Update(track);
                        _context.SaveChanges();
                        return Ok("Sikeres rögzítés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen zene!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a módosítás közben {ex.Message}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("DelTrack")]
        public IActionResult DeleteTrack(int id)
        {
            {
                try
                {
                    if (_context.Tracks.Select(t => t.Id).Contains(id))
                    {
                        _context.Remove(new Track { Id = id });
                        _context.SaveChanges();
                        return Ok("Sikeres törlés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen zene!");
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