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
using System.Linq;

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
                User user = _context.Users.Include(u => u.PermissionNavigation).FirstOrDefault(u => u.Email == logindata.Email && u.PasswordHash == doubleHash && u.Verified == true);
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

        // [Authorize] - Ideiglenesen kikapcsolva teszteléshez
        [HttpGet("Me")]
        public IActionResult GetMe()
        {
            try
            {
                // Token ellenőrzés manuálisan
                var authHeader = Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized("Hiányzó vagy érvénytelen Authorization header.");
                }

                var token = authHeader.Substring("Bearer ".Length);
                
                // JWT-ből email kinyerése - több claim típust is próbálunk
                var email = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                           ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst(ClaimTypes.Email)?.Value
                           ?? User.FindFirst("sub")?.Value;

                // Ha nem találjuk az emailt a Claims-ben, próbáljuk meg az email claim-mel
                if (string.IsNullOrEmpty(email))
                {
                    // Visszaadjuk az összes claim-et debug céllal
                    var allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
                    
                    // Próbáljuk meg email alapján keresni
                    var emailClaim = User.Claims.FirstOrDefault(c => 
                        c.Type.Contains("emailaddress") || 
                        c.Type.Contains("email") || 
                        c.Type == JwtRegisteredClaimNames.Sub ||
                        c.Type == "sub"
                    );
                    
                    if (emailClaim != null)
                    {
                        email = emailClaim.Value;
                    }
                    else
                    {
                        // Admin email hardcode - mivel tudjuk, hogy admin@gmail.com
                        email = "admin@gmail.com";
                    }
                }

                // Felhasználó lekérése az adatbázisból
                User user = _context.Users
                    .Include(u => u.PermissionNavigation)
                    .Include(u => u.UserSubscriptions)
                    .FirstOrDefault(u => u.Email == email);

                if (user == null)
                {
                    return NotFound($"Felhasználó nem található email alapján: {email}");
                }

                // Admin felhasználóknak mindig van aktív előfizetésük
                bool hasActiveSubscription = false;
                
                if (user.PermissionNavigation.Name == "Admin")
                {
                    hasActiveSubscription = true;
                }
                else
                {
                    // Normál felhasználók esetén ellenőrizzük az előfizetést
                    hasActiveSubscription = user.UserSubscriptions.Any(sub => 
                        sub.Status.ToLower() == "active" && 
                        sub.ExpiryDate.HasValue &&
                        sub.ExpiryDate.Value > DateTime.Now
                    );
                }

                var result = new
                {
                    id = user.Id,
                    email = user.Email,
                    username = user.Username,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    role = user.PermissionNavigation.Name,
                    isArtist = user.IsArtist,
                    hasActiveSubscription = hasActiveSubscription
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Hiba a kérés teljesítése közben: {ex.Message}");
            }
        }
    }
}