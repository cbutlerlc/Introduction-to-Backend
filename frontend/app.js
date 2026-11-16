const button = document.getElementById("loadPosts");
const container = document.getElementById("posts");

button.addEventListener("click", loadPosts);
async function loadPosts() {
  container.textContent = "Loading posts...";
  try {
    const response = await 
fetch("/api/v1/posts/getPosts");    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();
    container.replaceChildren();
    if (posts.length === 0) {
      container.textContent = "No posts found.";
      return;
    }
    posts.forEach((post) => {
      const item = document.createElement("p");
       // Get the username of the person who created the Post
    const author = post.createdBy?.username ?? "Unknown author";
      item.textContent = `${post.title} - ${post.description} - Created by: ${author}`;

	  // add the delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      // Add the click event
      deleteButton.addEventListener("click", async () => {
        console.log("Delete clicked:", post._id);

        const response = await fetch(`/api/v1/posts/delete/${post._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await loadPosts();
        } else {
          alert("Delete failed");
        }
      });
//add edit button
 const editButton = document.createElement("button");
      editButton.textContent = "Edit";
//add the click event for edit button
editButton.addEventListener("click", async () => {
        console.log("Edit clicked:", post._id);
		
		//add updated data to description - need to prompt the user
		
		const newDescription = prompt(
    "Enter the new description:",
    post.description
);
		
		
if (newDescription === null || !newDescription.trim()) {
    return;
}
        const response = await fetch(`/api/v1/posts/update/${post._id}`, {
          method: "PATCH",
		  headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        description: newDescription
    })
        });

        if (response.ok) {
          await loadPosts();
        } else {
          alert("Edit failed");
        }
      });
item.appendChild(editButton);

item.appendChild(deleteButton);

container.appendChild(item);
    });
  } catch (error) {
    container.textContent = "Could not load posts.";
    console.error(error);
  }
}

//users

const button2 = document.getElementById("loadUsers");
const container2 = document.getElementById("users");

button2.addEventListener("click", loadUsers);

async function loadUsers() {
  container2.textContent = "Loading users...";
  try {
    const response = await fetch("/api/v1/users/getUsers");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const users = await response.json();
    container2.replaceChildren();
    if (users.length === 0) {
      container2.textContent = "No users found.";
      return;
    }
    users.forEach((user) => {
      const item = document.createElement("p");
      item.textContent = `${user.username} -  (Email: ${user.email})`;
      container2.appendChild(item);
    });
  } catch (error) {
    container2.textContent = "Could not load users.";
    console.error(error);
  }
}
async function loadUserOptions() {
    try {
        // Retrieve all users from the Express API
        const response = await fetch("/api/v1/users/getUsers");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Convert the JSON response into a JavaScript array
        const users = await response.json();

        // Find the dropdown in the HTML form
        const select = document.getElementById("createdBy");

        // Add each user to the dropdown
        users.forEach((user) => {
            const option = document.createElement("option");

            // Store the user's MongoDB ID
            option.value = user._id;

            // Display the username
            option.textContent = user.username;

            // Add the option to the dropdown
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Could not load users:", error);
    }
}

// Run the function when the page loads
loadUserOptions();
//form
const form = document.querySelector("#postForm");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
  // Prevent the page from reloading
  event.preventDefault();

  // Get the values entered into the form
  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const createdBy = document.querySelector("#createdBy").value;

  // Create a JavaScript object containing the form data
  const post = {
    title: title,
    description: description,
    createdBy: createdBy
  
  };

  try {
    // Send the data to the Express API
    const response = await fetch("/api/v1/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    // Read the response from the server
    const result = await response.json();

    // Display success message
    message.textContent = "Post created successfully!";

    // Clear the form
    form.reset();
  } catch (error) {
    message.textContent = error.message;
  }
});
