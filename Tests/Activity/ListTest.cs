using Application.Activities;
using Application.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Moq;
using Persistence;
using System;
using System.Threading.Tasks;
using Xunit;

namespace tests.Activity
{
    public class ListTest
    {
        private readonly List.Handler _sut;
        private readonly Mock<IUserAccessor> _userAccessorMock = new Mock<IUserAccessor>();

        public ListTest()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(List.Handler).Assembly);
            });
            var mapper = configuration.CreateMapper();
            var dbContextOptions = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "reactivities")
                .Options;
            var context = new DataContext(dbContextOptions);
            context.Database.EnsureCreated();
            Seed.SeedActivities(context).Wait();
            _sut = new List.Handler(context, mapper, _userAccessorMock.Object);
        }

        [Fact]
        public async Task ShouldGetTheListOfActivities()
        {
            int? limit = 10;
            int? offset = 0;
            bool isGoing = true;
            bool isHost = false;
            var query = new List.Query(limit, offset, isGoing, isHost, null);
            var result = await _sut.Handle(query, new System.Threading.CancellationToken(false));
            Assert.NotNull(result);
        }
    }
}