using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Extensions.DependencyInjection;
using MMZ.Controllers;
using MMZ.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MMZ.Tests
{
    [TestClass]
    public class ArtistControllerTests
    {
        private MmzContext _context;
        private ArtistController _controller;

        private MmzContext CreateInMemoryContext()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            var options = new DbContextOptionsBuilder<MmzContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .UseInternalServiceProvider(serviceProvider)
                .Options;

            return new MmzContext(options);
        }

        [TestInitialize]
        public void TestInitialize()
        {
            _context = CreateInMemoryContext();

            // Teszt adatok
            var artist1 = new Artist { Id = 1, Name = "Test Artist 1", Description = "Desc 1" };
            var artist2 = new Artist { Id = 2, Name = "Test Artist 2", Description = "Desc 2" };

            _context.Artists.AddRange(artist1, artist2);
            _context.SaveChanges();
            _context.ChangeTracker.Clear();

            _controller = new ArtistController(_context);
        }

        [TestMethod]
        public void GetArtists_ReturnsAllArtists()
        {
            // Act
            var result = _controller.GetArtists();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var artists = (List<Artist>)okResult.Value;

            Assert.AreEqual(2, artists.Count);
        }

        [TestMethod]
        public void GetArtistById_ExistingId_ReturnsOk()
        {
            // Act
            var result = _controller.GetArtistById(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var artist = (Artist)okResult.Value;

            Assert.AreEqual(1, artist.Id);
            Assert.AreEqual("Test Artist 1", artist.Name);
        }

        [TestMethod]
        public void GetArtistById_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.GetArtistById(999);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            var nfResult = (NotFoundObjectResult)result;
            var errorArtist = (Artist)nfResult.Value;

            Assert.AreEqual(-1, errorArtist.Id);
            Assert.IsTrue(errorArtist.Name.Contains("nincs ilyen azonosítójú zenész"));
        }

        [TestMethod]
        public void PostArtist_ValidArtist_ReturnsNewId()
        {
            // Arrange
            var newArtist = new Artist
            {
                Name = "New Artist",
                Description = "New Description"
            };

            // Act
            var result = _controller.PostArtist(newArtist);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;

            Assert.IsNotNull(okResult.Value);
            int newId = int.Parse(okResult.Value.ToString());
            Assert.IsTrue(newId > 0);
        }

        [TestMethod]
        public void PutArtist_ExistingArtist_ReturnsOk()
        {
            // Arrange
            var existingArtist = _context.Artists.First();
            existingArtist.Name = "Updated Name";

            // Act
            var result = _controller.PutArtist(existingArtist);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            Assert.AreEqual("Sikeres rögzítés", okResult.Value);

            var updated = _context.Artists.Find(existingArtist.Id);
            Assert.AreEqual("Updated Name", updated.Name);
        }

        [TestMethod]
        public void PutArtist_NonExistingArtist_ReturnsNotFound()
        {
            // Arrange
            var fakeArtist = new Artist { Id = 999, Name = "Ghost Artist" };

            // Act
            var result = _controller.PutArtist(fakeArtist);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen zenész!", ((NotFoundObjectResult)result).Value);
        }

        [TestMethod]
        public void DeleteArtist_ExistingId_ReturnsOk()
        {
            // Arrange
            int idToDelete = 2;

            // Act
            var result = _controller.DeleteArtist(idToDelete);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres törlés", ((OkObjectResult)result).Value);

            var deleted = _context.Artists.Find(idToDelete);
            Assert.IsNull(deleted);
        }

        [TestMethod]
        public void DeleteArtist_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteArtist(888);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen zenész!", ((NotFoundObjectResult)result).Value);
        }
    }
}