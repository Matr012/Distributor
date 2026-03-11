using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ;
using MMZ.Models;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class RegistryController : ControllerBase
    {
        private readonly MmzContext _context;
        public RegistryController(MmzContext context)
        {
            _context = context;
        }

        [HttpPost("NewRegistry")]
        public async Task<IActionResult> PostReg(User user)
        {
            try
            {
                if (_context.Users.FirstOrDefault(u => u.Username == user.Username) != null)
                {
                    return BadRequest("Foglalt felhasználónév.");
                }
                if (_context.Users.FirstOrDefault(u => u.Email == user.Email) != null)
                {
                    return BadRequest("Ez az email cím már használatban van.");
                }
                user.Verified = false;
                user.Permission = 4;
                user.PasswordHash = Program.CreateSHA256(user.PasswordHash);
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                Program.SendEmail(user.Email, "Regisztráció megerősítése", $"http://localhost:5179/Registry?felhasznaloNev={user.Username}&email={user.Email}");
                return Ok("Sikeres regisztráció, erősítse meg a megadott emailre kiküldött linkre kattintva.");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetRegistry")]
        public async Task<IActionResult> ConfirmReg(string felhasznaloNev, string email)
        {
            try
            {
                User? user = await _context.Users.FirstOrDefaultAsync(u => u.Username == felhasznaloNev && u.Email == email);
                if (user != null)
                {
                    user.Verified = true;
                    user.Permission = 4;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok("Sikeres megerősítés.");
                }
                else
                {
                    return BadRequest("Hibás adatok!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}