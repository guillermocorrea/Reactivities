using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace API.IntegrationTests
{
    public class UnitTest1
    {
        private readonly HttpClient _client;
        public UnitTest1()
        {
            var appFactory = new WebApplicationFactory<Startup>();
            _client = appFactory.CreateClient();
        }

        [Fact]
        public async Task Test1()
        {
            var response = await _client.GetAsync("/api/activities");
        }
    }
}
