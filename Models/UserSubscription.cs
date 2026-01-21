namespace MMZ.Models
{
    public class UserSubscription
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PlanId { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? AutoRenew { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual SubscriptionPlan? Plan { get; set; }
        public virtual User User { get; set; } = null!;
    }
}
