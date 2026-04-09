using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MMZ.Controllers;
using MMZ.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace MMZ.Controllers.Tests
{
    [TestClass]
    public class AlbumControllerTests
    {
        private MmzContext _context;
        private AlbumController _controller;

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
            var album1 = new Album { Id = 1, Title = "Test Album 1", UserId = 101, Status = "Active" };
            var album2 = new Album { Id = 2, Title = "Test Album 2", UserId = 102, Status = "Pending" };

            _context.Albums.AddRange(album1, album2);
            _context.SaveChanges();
            _context.ChangeTracker.Clear();

            _controller = new AlbumController(_context);
        }

        [TestMethod]
        public void GetAlbums_ReturnsAllAlbums()
        {
            // Act
            var result = _controller.GetAlbums();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var albums = (List<Album>)okResult.Value;

            Assert.AreEqual(2, albums.Count);
            Assert.AreEqual("Test Album 1", albums[0].Title);
        }

        [TestMethod]
        public void GetAlbumById_ExistingId_ReturnsOk()
        {
            // Act
            var result = _controller.GetAlbumById(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var album = (Album)okResult.Value;

            Assert.AreEqual(1, album.Id);
            Assert.AreEqual("Test Album 1", album.Title);
        }

        [TestMethod]
        public void GetAlbumById_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.GetAlbumById(999);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            var nfResult = (NotFoundObjectResult)result;
            var errorAlbum = (Album)nfResult.Value;

            Assert.AreEqual(-1, errorAlbum.Id);
            Assert.IsTrue(errorAlbum.Title.Contains("nincs ilyen azonosítójú"));
        }

        [TestMethod]
        public void PostAlbum_ValidAlbum_ReturnsId()
        {
            // Arrange
            var newAlbum = new Album
            {
                Title = "New Test Album",
                UserId = 103,
                ArtistId = 1
            };

            // Act
            var result = _controller.PostAlbum(newAlbum);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;

            // Id
            Assert.IsNotNull(okResult.Value);
            int newId = int.Parse(okResult.Value.ToString());
            Assert.IsTrue(newId > 0);
        }

        [TestMethod]
        public void PutAlbum_ExistingAlbum_ReturnsOk()
        {
            // Arrange
            var existingAlbum = _context.Albums.First();
            existingAlbum.Title = "Updated Title";

            // Act
            var result = _controller.PutAlbum(existingAlbum);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            Assert.AreEqual("Sikeres rögzítés", okResult.Value);

            var updated = _context.Albums.Find(existingAlbum.Id);
            Assert.AreEqual("Updated Title", updated.Title);
        }

        [TestMethod]
        public void PutAlbum_NonExistingAlbum_ReturnsNotFound()
        {
            // Arrange
            var fakeAlbum = new Album { Id = 999, Title = "Ghost" };

            // Act
            var result = _controller.PutAlbum(fakeAlbum);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen Album!", ((NotFoundObjectResult)result).Value);
        }

        [TestMethod]
        public void DeleteAlbum_ExistingId_ReturnsOk()
        {
            // Arrange
            int idToDelete = 2;

            // Act
            var result = _controller.DeleteAlbum(idToDelete);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres törlés", ((OkObjectResult)result).Value);

            var deleted = _context.Albums.Find(idToDelete);
            Assert.IsNull(deleted);
        }

        [TestMethod]
        public void DeleteAlbum_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteAlbum(888);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen Album!", ((NotFoundObjectResult)result).Value);
        }
    }
}