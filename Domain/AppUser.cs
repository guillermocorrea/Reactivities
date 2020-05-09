using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            this.UserActivities = new List<UserActivity>();
        }

        public string DisplayName { get; set; }
        public virtual ICollection<UserActivity> UserActivities { get; set; }
    }
}