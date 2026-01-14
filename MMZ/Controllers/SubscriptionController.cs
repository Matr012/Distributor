using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        [HttpGet("Subscriptions")]
        public IActionResult GetSubscriptions()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<Subscription> subscriptions = context.Subscriptions.ToList();
                    return Ok(subscriptions);
                }
                catch (Exception ex)
                {
                    List<Subscription> valasz = new()
                    {
                        new Subscription { Id = -1,
                                   Status = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("SubscriptionById")]
        public IActionResult GetSubscriptionById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    Subscription eredmeny = context.Subscriptions.FirstOrDefault(t => t.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        Subscription valasz = new Subscription
                        {
                            Id = -1,
                            Status = "Hiba történt: nincs ilyen azonosítójú album!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    Subscription valasz = new Subscription
                    {
                        Id = -1,
                        Status = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpPost("NewSubscription")]
        public IActionResult PostSubscription(Subscription subscription)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.Subscriptions.Add(subscription);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

        [HttpPut("ModifySubscription")]
        public IActionResult PutTrack(Subscription subscription)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Subscriptions.Contains(subscription))
                    {
                        context.Subscriptions.Update(subscription);
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

        [HttpDelete("DelSubscription")]
        public IActionResult DeleteSubscription(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Subscriptions.Select(s => s.Id).Contains(id))
                    {
                        context.Remove(new Subscription { Id = id });
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