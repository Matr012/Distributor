using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize("admin")]
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

        [HttpPost("NewTrack")]
        public IActionResult PostTrack(Track track)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.Tracks.Add(track);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

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