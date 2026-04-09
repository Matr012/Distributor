using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class UserBillingController : ControllerBase
    {
        private readonly MmzContext _context;
        public UserBillingController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("UserBillings")]
        public IActionResult GetUserBillings()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<UserBilling> userbillings = context.UserBillings.ToList();
                    return Ok(userbillings);
                }
                catch (Exception ex)
                {
                    List<UserBilling> valasz = new()
                    {
                        new UserBilling { Id = -1,
                                   BillingName = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("UserBillingById")]
        public IActionResult GetUserBillingById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    UserBilling eredmeny = context.UserBillings.FirstOrDefault(ub => ub.Id == id);
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
        [Authorize]
        [HttpPost("NewUserBilling")]
        public IActionResult PostUserBilling(UserBilling userBilling)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.UserBillings.Add(userBilling);
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
        [HttpPut("ModifyUserBilling")]
        public IActionResult PutUser(UserBilling userBilling)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserBillings.Contains(userBilling))
                    {
                        context.UserBillings.Update(userBilling);
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
        [Authorize(Roles = "Admin")]
        [HttpDelete("DelUserBilling")]
        public IActionResult DeleteUserBilling(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserBillings.Select(ub => ub.Id).Contains(id))
                    {
                        context.Remove(new UserBilling { Id = id });
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