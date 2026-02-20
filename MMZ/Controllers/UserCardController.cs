using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMZ.Models;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize("admin")]
    public class UserCardController : ControllerBase
    {
        private readonly MmzContext _context;
        public UserCardController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("UserCards")]
        public IActionResult GetUserCards()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<UserCard> usercards = context.UserCards.ToList();
                    return Ok(usercards);
                }
                catch (Exception ex)
                {
                    List<UserCard> valasz = new()
                    {
                        new UserCard { Id = -1,
                                   CardHolderName = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpGet("UserCardById")]
        public IActionResult GetUserCardById(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    UserCard eredmeny = context.UserCards.FirstOrDefault(uc => uc.Id == id);
                    if (eredmeny != null)
                        return Ok(eredmeny);
                    else
                    {
                        UserCard valasz = new UserCard
                        {
                            Id = -1,
                            CardHolderName = "Hiba történt: nincs ilyen azonosítójú felhasználó!",
                        };
                        return NotFound(valasz);
                    }
                }
                catch (Exception ex)
                {
                    UserCard valasz = new UserCard
                    {
                        Id = -1,
                        CardHolderName = "Hiba történt: " + ex.Message,
                    };
                    return BadRequest(valasz);
                }
            }
        }

        [HttpPost("NewUserCard")]
        public IActionResult PostUserCard(UserCard userCard)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    context.UserCards.Add(userCard);
                    context.SaveChanges();
                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba a rögzítés közben {ex.Message}");
                }
            }
        }

        [HttpPut("ModifyUserCard")]
        public IActionResult PutUserCard(UserCard userCard)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserCards.Contains(userCard))
                    {
                        context.UserCards.Update(userCard);
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

        [HttpDelete("DelUserCard")]
        public IActionResult DeleteUserCard(int id)
        {
            using (var context = new MmzContext())
            {
                try
                {
                    if (context.UserCards.Select(uc => uc.Id).Contains(id))
                    {
                        context.Remove(new UserCard { Id = id });
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