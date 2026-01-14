using MMZ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CegautokAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SubscriptionPlanController : ControllerBase
    {
        private readonly MmzContext _context;
        public SubscriptionPlanController(MmzContext context)
        {
            _context = context;
        }
        [HttpGet("SubscriptionPlans")]
        public IActionResult GetSubscriotion_Plans()
        {
            using (var context = new MmzContext())
            {
                try
                {
                    List<SubscriptionPlan> subscriptionPlans = context.SubscriptionPlans.ToList();
                    return Ok(subscriptionPlans);
                }
                catch (Exception ex)
                {
                    List<SubscriptionPlan> valasz = new()
                    {
                        new SubscriptionPlan { Id = -1,
                                   Name = "Hiba történt: "+ex.Message,
                        }
                    };
                    return BadRequest(valasz);
                }
            }
        }

    }
}