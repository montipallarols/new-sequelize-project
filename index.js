const express = require("express");
const app = express()
const port = 4000

const User = require("./models").user;
const TodoList = require("./models").todoList;

app.use(express.json());

app.post("/echo", (req, res) => {
    res.json(req.body);
  });

// Create a new user account
app.post("/users", async (req, res, next) => {
    try {
      const email = req.body.email;
      if (!email || email === " ") {
        res.status(400).send("Must provide an email address");
      } else {
        const user = await User.create(req.body);
        res.json(user);
      }
    } catch (e) {
      next(e);
    }
  });


app.post("/user/:userId/todoLists", async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId)
        const user = await User.findByPk(userId)
        if (!user) {
            res.status(404).send("User not found")
        } else {
            const newList = await TodoList.create({userId, ...req.body})
            res.json(newList)
        }
    } catch(e) {
        next(e)
    }
})


app.put("/todoLists/:listId", async (req, res, next) => {
    try {
      const listId = parseInt(req.params.listId);
      const listToUpdate = await TodoList.findByPk(listId);
      if (!listToUpdate) {
        res.status(404).send("List not found");
      } else {
        const updatedList = await listToUpdate.update(req.body);
        res.json(updatedList);
      }
    } catch (e) {
      next(e);
    }
  });


  
  app.get("/users/:userId", async (req, res, next) => {
      try {
        const userId = parseInt(req.params.userId);
        const user = await User.findByPk(userId);
        if (!user) {
          res.status(404).send("User not found");
        } else {
          res.send(user);
        }

      } catch(e) {
          next(e);
      }
  })

  app.get("/todoLists", async (req, res, next) => {
      try {
        const lists = await TodoList.findAll()
        res.json(lists)
      } catch(e) {
          next(e)
      }
  })

  app.get("/users/:userId/lists", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId, {
        include: [TodoList],
      });
      if (user) {
        res.send(user.todoLists);
      } else {
        res.status(404).send("User not found");
      }
    } catch (e) {
      next(e);
    }
  });

//   Implement the route to create a list for a user on the /users/:userId/lists endpoint.
  app.post("/users/:userId/lists", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).send("User not found");
      } else {
        const newList = await TodoList.create({ userId, ...req.body });
        res.json(newList);
      }
    } catch (e) {
      next(e);
    }
  });


  app.put("/users/:userId", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const userToUpdate = await User.findByPk(userId);
      if (!userToUpdate) {
        res.status(404).send("User not found");
      } else {
        const updatedUser = await userToUpdate.update(req.body);
        res.json(updatedUser);
      }
    } catch (e) {
      next(e);
    }
  });

  // Delete a user's list
  app.delete("/users/:userId/lists/:listId", async (req, res, next) => {
      try {
        const listId = parseInt(req.params.listId)
        const listToDelete = await TodoList.findByPk(listId)
        if (!listToDelete) {
            res.status(404).send("List not found")
        } else {
            const deletedList = await listToDelete.destroy();
            res.json(deletedList)
        }
      } catch(e) {
          next(e)
      }
  })


  // Delete all user's lists
  app.delete("/users/:userId/lists", async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await User.findByPk(userId, { include: [TodoList] });
      if (!user) {
        res.status(404).send("User not found");
      } else {
        const allLists = await TodoList.destroy({ where: { userId: userId } });
       console.log(allLists);

      res.json(allLists);
      }
    } catch (e) {
      next(e);
    }
  });




app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})