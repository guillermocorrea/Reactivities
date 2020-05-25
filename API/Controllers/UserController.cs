using System.Threading.Tasks;
using Application.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class UserController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> currentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpPost("facebook")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> FacebookLogin(ExternalLogin.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}