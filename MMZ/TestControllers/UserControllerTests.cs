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
    public class UserControllerTests
    {
        private MmzContext _context;
        private UserController _controller;

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

            // Alapértelmezett jogosultság felhasználóknak
            var privilege = new Privilege { Id = 4, Name = "User" };
            _context.Privileges.Add(privilege);

            var user1 = new User
            {
                Id = 1,
                FirstName = "János",
                LastName = "Teszt",
                Username = "tesztjanos",
                Email = "janos@test.hu",
                Permission = 4,
                PasswordHash = "hash123",
                Phone = "06301234567"
            };

            _context.Users.Add(user1);
            _context.SaveChanges();
            _context.ChangeTracker.Clear();

            _controller = new UserController(_context);
        }

        [TestMethod]
        public void GetUsers_ReturnsOkAndList()
        {
            // Act
            var result = _controller.GetUsers();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;

            var users = okResult.Value as System.Collections.IEnumerable;
            Assert.IsNotNull(users);

            int count = 0;
            foreach (var user in users) count++;
            Assert.AreEqual(1, count);
        }

        [TestMethod]
        public void GetUserById_ExistingId_ReturnsUserWithPrivilege()
        {
            // Act
            var result = _controller.GetUserById(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = (OkObjectResult)result;
            var user = (User)okResult.Value;

            Assert.AreEqual("tesztjanos", user.Username);
            Assert.IsNotNull(user.PermissionNavigation);
        }

        [TestMethod]
        public void GetUserById_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.GetUserById(999);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            var nfResult = (NotFoundObjectResult)result;
            var errorUser = (User)nfResult.Value;

            Assert.AreEqual(-1, errorUser.Id);
            Assert.IsTrue(errorUser.Username.Contains("nincs ilyen azonosítójú felhasználó!"));
        }

        [TestMethod]
        public void PostUser_ValidUser_ReturnsOk()
        {
            // Arrange
            var newUser = new User
            {
                FirstName = "Béla",
                LastName = "Új",
                Username = "ujbela",
                Email = "bela@test.hu",
                PasswordHash = "abc",
                Phone = "123",
                Permission = 4
            };

            // Act
            var result = _controller.PostUser(newUser);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres rögzítés", ((OkObjectResult)result).Value);
        }

        [TestMethod]
        public void PutUser_ExistingUser_ReturnsOk()
        {
            // Arrange
            var user = _context.Users.First();
            user.FirstName = "Módosított";

            // Act
            var result = _controller.PutUser(user);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres rögzítés", ((OkObjectResult)result).Value);

            var updated = _context.Users.Find(user.Id);
            Assert.AreEqual("Módosított", updated.FirstName);
        }

        [TestMethod]
        public void DeleteUser_ExistingId_ReturnsOk()
        {
            // Act
            var result = _controller.DeleteUser(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            Assert.AreEqual("Sikeres törlés", ((OkObjectResult)result).Value);
            Assert.IsNull(_context.Users.Find(1));
        }

        [TestMethod]
        public void DeleteUser_NonExistingId_ReturnsNotFound()
        {
            // Act
            var result = _controller.DeleteUser(888);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            Assert.AreEqual("Nincs ilyen felhasználó!", ((NotFoundObjectResult)result).Value);
        }
    }
}