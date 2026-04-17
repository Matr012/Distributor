using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;
using MMZ.DTOs;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class TrackController : ControllerBase
    {
        [HttpGet("Tracks")]
        public IActionResult GetTracks()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<Track> tracks = context.Tracks.ToList();
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
            using (var context = new MmzContext())
            {
                try
                {
                    Track eredmeny = context.Tracks.FirstOrDefault(t => t.Id == id);
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
        public IActionResult PostTrack(TrackDTO trackDto)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    // Log incoming data for debugging
                    Console.WriteLine($"[DEBUG] Creating track: AlbumId={trackDto.AlbumId}, Title={trackDto.Title}");
                    
                    // Convert base64 audio to byte array
                    byte[]? audioBytes = null;
                    if (!string.IsNullOrEmpty(trackDto.AudioPath))
                    {
                        try
                        {
                            audioBytes = Convert.FromBase64String(trackDto.AudioPath);
                            Console.WriteLine($"[DEBUG] Audio converted to {audioBytes.Length} bytes");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"[ERROR] Failed to convert audio base64: {ex.Message}");
                            return BadRequest("Invalid audio data format");
                        }
                    }
                    
                    // Convert DTO to Track model
                    var track = new Track
                    {
                        AlbumId = trackDto.AlbumId,
                        TrackNumber = trackDto.TrackNumber,
                        Title = trackDto.Title,
                        Subtitle = trackDto.Subtitle,
                        IsrcRequest = trackDto.IsrcRequest,
                        OriginalReleaseDate = trackDto.OriginalReleaseDate,
                        Collaborators = trackDto.Collaborators,
                        ExplicitLyrics = trackDto.ExplicitLyrics,
                        Composers = trackDto.Composers,
                        Lyricists = trackDto.Lyricists,
                        AudioPath = audioBytes,
                        StyleId = trackDto.StyleId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    context.Tracks.Add(track);
                    context.SaveChanges();
                    
                    Console.WriteLine($"[DEBUG] Track created successfully with ID: {track.Id}");
                    return Ok(track.Id.ToString());
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ERROR] Failed to create track: {ex.Message}");
                    Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                    if (ex.InnerException != null)
                    {
                        Console.WriteLine($"[ERROR] Inner exception: {ex.InnerException.Message}");
                    }
                    return BadRequest($"Hiba a rögzítés közben: {ex.Message}");
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyTrack")]
        public IActionResult PutTrack(Track track)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Tracks.Contains(track))
                    {
                        context.Tracks.Update(track);
                        context.SaveChanges();
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
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Tracks.Select(t => t.Id).Contains(id))
                    {
                        context.Remove(new Track { Id = id });
                        context.SaveChanges();
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