using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly MmzContext _context;
        public UserController(MmzContext context)
        {
            _context = context;
        }
        
        [HttpGet("Users")]
        public IActionResult GetUsers()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    var users = context.Users.Select(u => new {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        u.Username,
                        u.Email,
                        u.Permission,
                        u.ProfilePic
                    }).ToList();
                    return Ok(users);
                }
                catch (Exception ex)
                {
                    List<User> valasz = new()
                    {
                        new User { Id = -1,
                                   Username = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("UserById")]
        public IActionResult GetUserById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    User eredmeny = context.Users.Include(u => u.PermissionNavigation).FirstOrDefault(x => x.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        User valasz = new User
                        {
                            Id = -1,
                            Username = "Hiba történt: nincs ilyen azonosítójú felhasználó!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    User valasz = new User
                    {
                        Id = -1,
                        Username = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("NewUser")]
        public IActionResult PostUser(User user)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.Users.Add(user);
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
        [HttpPut("ModifyUser")]
        public IActionResult PutUser(User user)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Users.Contains(user))
                    {
                        context.Users.Update(user);
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
        [HttpDelete("DelUser")]
        public IActionResult DeleteUser(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.Users.Select(u => u.Id).Contains(id))
                    {
                        context.Remove(new User { Id = id });
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