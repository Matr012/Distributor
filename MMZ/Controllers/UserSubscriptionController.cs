using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserSubscriptionController : ControllerBase
    {
        private readonly MmzContext _context;
        public UserSubscriptionController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("UserSubscriptions")]
        public IActionResult GetUserSubscriptions()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<UserSubscription> usersubs = context.UserSubscriptions.ToList();
                    return Ok(usersubs);
                }
                catch (Exception ex)
                {
                    List<UserSubscription> valasz = new()
                    {
                        new UserSubscription { Id = -1,
                                   Status = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("UserSubscriptionById")]
        public IActionResult GetUserSubscriptionById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    UserSubscription eredmeny = context.UserSubscriptions.FirstOrDefault(us => us.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        UserBilling valasz = new UserBilling
                        {
                            Id = -1,
                            BillingName = "Hiba történt: nincs ilyen azonosítójú felhasználó!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    UserBilling valasz = new UserBilling
                    {
                        Id = -1,
                        BillingName = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpPost("NewUserSubscription")]
        public IActionResult PostUserSubscription(UserSubscription userSubscription)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.UserSubscriptions.Add(userSubscription);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

        [HttpPut("ModifyUserSubscription")]
        public IActionResult PutUser(UserSubscription userSubscription)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserSubscriptions.Contains(userSubscription))
                    {
                        context.UserSubscriptions.Update(userSubscription);
                        context.SaveChanges();
                        return Ok("Sikeres rögzítés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen felhasználó!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a módosítás közben {ex.Message}");
                }
            }
        }

        [HttpDelete("DelUserSubscription")]
        public IActionResult DeleteUserSubscription(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserSubscriptions.Select(us => us.Id).Contains(id))
                    {
                        context.Remove(new UserSubscription { Id = id });
                        context.SaveChanges();
                        return Ok("Sikeres törlés");
                    }
                    else
                    {
                        return NotFound("Nincs ilyen felhasználó!");
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