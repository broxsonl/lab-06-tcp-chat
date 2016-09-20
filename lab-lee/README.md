##Lab-06 TCP Chat Creation

**About This Project**

This project's purpose is to create a locally hosted chat server that allows several local instances to connect and communicate with one another.

`client.js` creates a user object for the chatroom every time someone connects to the room.

`server.js` handles the logic for creating the server, handling user input, and appropriately displaying the correct messages to other users.

Once connected to the chat, you may run `/help` for a list of available chat commands.

**How to Run this Project**

Check out the [package.json] (https://github.com/broxsonl/lab-06-tcp-chat/blob/master/lab-lee/package.json) file for the project to see the specific Developer Dependencies required to run this project. Or, enter the following command in your local copy of the repository:

        npm  i -D eslint gulp-eslint gulp-mocha mocha mocha-eslint

**How to connect to the server**

In your terminal, navigate to the top of this project's directory. Run the following command:

        node server.js

If successful, this should produce the log to the console, `server running on port [X]`, where [X] is the port number.

The PORT will default to 3000 if another is not specified. If you'd like to specify a port, run the following command (passing in a valid port number for [X]):

        PORT=[X] node server.js

To test local instances able to connect and chat together, open up additional terminals, navigate to the project directory and run the following command to connect to the chat server (once again passing in the same port for [X]):

        telnet localhost [X]

Connect with as many instances as you'd like.

Happy chatting!
