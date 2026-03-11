using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MMZ;
using MMZ.DTOs;
using MMZ.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MMZ.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly Jwtsettings _jwtSettings;
        private readonly MmzContext _context;

        public LoginController(Jwtsettings jwtSettings, MmzContext context)
        {
            _jwtSettings = jwtSettings;
            _context = context;
        }
        /*[HttpGet]
        public IActionResult GetSalt(string loginName)
        {
            try
            {
                if (_context.Users.Select(u => u.Username).Contains(loginName))
                {
                    return Ok(_context.Users.FirstOrDefault(u => u.Username == loginName).PasswordHash);
                }
                else
                {
                    return Ok("");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a kérés teljesítése közben: {ex.Message}");
            }

        }*/

        [HttpPost("Login")]
        public IActionResult Login(LoginDTO logindata)
        {
            try
            {
                string doubleHash = Program.CreateSHA256(logindata.Hash);
                User user = _context.Users.Include(u => u.PermissionNavigation).FirstOrDefault(u => u.Email == logindata.Email && u.PasswordHash == doubleHash && u.Verified == false);
                if (user == null)
                {
                    return NotFound("Hibás bejelentkezési adatok.");
                }
                else
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                        new Claim(ClaimTypes.Role, user.PermissionNavigation.Name),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: _jwtSettings.Issuer,
                        audience: _jwtSettings.Audience,
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(_jwtSettings.ExpirityMinutes),
                        signingCredentials: creds
                        );
                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a kérés teljesítése közben: {ex.Message}");
            }

        }
    }
}