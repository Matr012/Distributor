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
            {
                try
                {
                    var users = _context.Users.Select(u => new {
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
            {
                try
                {
                    User eredmeny = _context.Users.Include(u => u.PermissionNavigation).FirstOrDefault(x => x.Id == id);
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
            {
                try
                {
                    _context.Users.Add(user);
                    _context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }
        [Authorize]
        [HttpPatch("UpdateProfilePic")]
        public IActionResult UpdateProfilePic([FromBody] string base64Image)
        {
            var email = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var dbUser = _context.Users.FirstOrDefault(u => u.Email == email);
            if (dbUser == null)
                return NotFound("Felhasználó nem található.");

            try
            {
                string b64 = base64Image;
                if (b64.Contains(","))
                    b64 = b64.Substring(b64.IndexOf(",") + 1);

                dbUser.ProfilePic = Convert.FromBase64String(b64);
                dbUser.UpdatedAt = DateTime.UtcNow;
                _context.SaveChanges();
                return Ok("Profilkép frissítve.");
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException?.Message ?? ex.Message;
                return BadRequest($"Hiba a profilkép mentésekor: {msg}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("ModifyUser")]
        public IActionResult PutUser(User user)
        {
            {
                try
                {
                    if (_context.Users.Contains(user))
                    {
                        _context.Users.Update(user);
                        _context.SaveChanges();
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
            {
                try
                {
                    if (_context.Users.Select(u => u.Id).Contains(id))
                    {
                        _context.Remove(new User { Id = id });
                        _context.SaveChanges();
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