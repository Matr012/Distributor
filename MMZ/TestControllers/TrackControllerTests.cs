using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MMZ.Controllers;
using MMZ.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MMZ.Tests
{
    [TestClass]
    public class TrackControllerTests
    {
        private MmzContext _context;
        private TrackController _controller;

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
            var testAlbum = new Album { Id = 1, Title = "Test Album" };
            _context.Albums.Add(testAlbum);

            var track1 = new Track { Id = 1, AlbumId = 1, Title = "Track 1", TrackNumber = 1 };
            var track2 = new Track { Id = 2, AlbumId = 1, Title = "Track 2", TrackNumber = 2 };

            _context.Tracks.AddRange(track1, track2);
            _context.SaveChanges();
            _context.ChangeTracker.Clear();

            _controller = new TrackController(_context);
        }

        [TestMethod]
        public void GetTracks_ReturnsAllTracks()
        {
            // Act
            var result = _controller.GetTracks();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var tracks = (List<Track>)okResult.Value;

            Assert.AreEqual(2, tracks.Count);
        }

        [TestMethod]
        public void GetTrackById_ExistingId_ReturnsOk()
        {
            // Act
            var result = _controller.GetTrackById(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var track = (Track)okResult.Value;

            Assert.AreEqual(1, track.Id);
            Assert.AreEqual("Track 1", track.Title);
        }

        [TestMethod]
        public void GetTrackById_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.GetTrackById(999);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            var nfResult = (NotFoundObjectResult)result;
            var errorTrack = (Track)nfResult.Value;

            Assert.AreEqual(-1, errorTrack.Id);
            Assert.IsTrue(errorTrack.Title.Contains("nincs ilyen azonosítójú album!"));
        }

        [TestMethod]
        public void PostTrack_ValidTrack_ReturnsNewId()
        {
            // Arrange
            var newTrack = new Track
            {
                AlbumId = 1,
                Title = "New Song",
                TrackNumber = 3,
                ExplicitLyrics = "nincs"
            };

            // Act
            var result = _controller.PostTrack(newTrack);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;

            Assert.IsNotNull(okResult.Value);
            int newId = int.Parse(okResult.Value.ToString());
            Assert.IsTrue(newId > 0);
        }

        [TestMethod]
        public void PutTrack_ExistingTrack_ReturnsOk()
        {
            // Arrange
            var existingTrack = _context.Tracks.First();
            existingTrack.Title = "Updated Track Title";

            // Act
            var result = _controller.PutTrack(existingTrack);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            Assert.AreEqual("Sikeres rögzítés", okResult.Value);

            var updated = _context.Tracks.Find(existingTrack.Id);
            Assert.AreEqual("Updated Track Title", updated.Title);
        }

        [TestMethod]
        public void PutTrack_NonExistingTrack_ReturnsNotFound()
        {
            // Arrange
            var fakeTrack = new Track { Id = 999, Title = "Ghost Track" };

            // Act
            var result = _controller.PutTrack(fakeTrack);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen zene!", ((NotFoundObjectResult)result).Value);
        }

        [TestMethod]
        public void DeleteTrack_ExistingId_ReturnsOk()
        {
            // Arrange
            int idToDelete = 2;

            // Act
            var result = _controller.DeleteTrack(idToDelete);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres törlés", ((OkObjectResult)result).Value);

            var deleted = _context.Tracks.Find(idToDelete);
            Assert.IsNull(deleted);
        }

        [TestMethod]
        public void DeleteTrack_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteTrack(888);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen zene!", ((NotFoundObjectResult)result).Value);
        }
    }
}