// BUILD YOUR SERVER HERE
const express = require("express")
const db = require("./users/model")

const server = express()

// required to parse incoming JSON request data
server.use(express.json())


server.post("/api/users",  async (req, res) => {

    // const newUser = {
    //     name: req.body.name,
    //     bio: req.body.bio
    // }

	if (req.body.name || req.body.bio ) {
		const newUser = await db.insert({
            name: req.body.name,
            bio: req.body.bio
        })
    
        res.json(newUser)
	} else if  (!req.body.name || !req.body.bio ) {
		return res.status(400).json({ message: "Please provide name and bio for the user" })
	} else {
       return  res.status(500).json({
            message: "There was an error while saving the user to the database"
        })
    }
	
})


server.get("/api/users", async (req, res) => {
    const users =  await db.find()
    if (users) {
        res.json(users)
    } else {
        res.status(500).json({
            message: "The users information could not be retrieved.",
        })        
    }
})


server.get("/api/users/:id", async (req, res) => {
	const user =  await db.findById(req.params.id)

	if (user) {
		res.json(user)
	} else if (!user) {
		res.status(404).json({
			message: "The user with the specified ID does not exist",
		})
	} else {
        res.status(500).json({
            message: "The user information could not be retrieved"
        })
    }
})

server.delete("api/users/:id",  async (req, res) => {
	const user = await db.findById(req.params.id)

	if (user) {
		db.remove(user.id)
		// a successful but empty response
		res.status(204).end()
	} else {
		res.status(404).json({
			message: "The user with the specified ID does not exist",
		})
	}
})

server.put("api/uesrs/:id", async (req, res) => {
	const user =  await db.findById(req.params.id)


	if (user) {
		const updatedUser = db.updateUser(user.id, {
			// use a fallback value so we don't accidentally set it to empty
			name: req.body.name || user.name,
            bio: req.body.bio || user.bio
		})

        res.json(updatedUser)
        res.status(200).end()
	} else if (!user.id) {
		res.status(404).json({
			message: "The user with the specified ID does not exist",
		})
	} else if ((!user.name || !user.bio)) {
		res.status(400).json({
            message: "Please provide name and bio for the user"
        })
	} else {
        res.status(500).json({
            message: "The user information could not be modified"
        })
	}
})


module.exports = server; // EXPORT YOUR SERVER instead of {}