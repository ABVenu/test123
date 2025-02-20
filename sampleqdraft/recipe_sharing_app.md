# **Recipe Sharing App**  

### **Total Objective**  
Build an **Enhanced Recipe Sharing App** using Mongoose with `User` and `Recipe` schemas. Implement CRUD operations for both schemas, track recipe views, and display analytics for the application. Include middleware for logging requests and archiving deleted recipes.  

---  

### **Problem Statement**  
Create a Recipe Sharing App where:  
- Users can add multiple recipes (One-to-Many relationship).  
- Views are tracked for each recipe and incremented on access.  
- Users can view analytics such as total views, highest views, and recipe statistics.  
- Add middleware for request logging and deletion archiving.  

---  

## **Schema Design**  

### **User Schema**  
- `name`: String, required, minimum length of 3 characters  
- `email`: String, required, unique, must be valid  
- `createdAt`: Date, default to the current date  

### **Recipe Schema**  
- `title`: String, required, minimum length of 3 characters  
- `description`: String, optional  
- `ingredients`: Array of strings, required  
- `instructions`: String, required  
- `author`: ObjectId, required (references `User` schema)  
- `views`: Number, default to 0  
- `createdAt`: Date, default to the current date  

### **Archived Recipe Schema** (For Deletion Archiving)  
-  Same as that of Recipe Schema 
- `archivedAt`: Date, default to the current date  

---  

## **Routes**  

1. **Add User** (`POST /add-user`):  
   - Add a new user with `name` and `email`.  

2. **Add Recipe** (`POST /add-recipe`):  
   - Add a new recipe linked to the author (user).  

3. **Update Recipe** (`PUT /update-recipe/:recipeId`):  
   - Update recipe details (`title`, `description`, `ingredients`, `instructions`).  

4. **Delete Recipe** (`DELETE /delete-recipe/:recipeId`):  
   - Delete a recipe and archive it.  

5. **Get All Recipes** (`GET /recipes`):  
   - Retrieve all recipes with populated author details.  
   - Ensure Recipe's are avaialble in case partial title of recipe is seacrched
   (`GET /recipes/?title=<partial/full title>`) 

6. **Get Recipe by ID** (`GET /recipe/:recipeId`):  
   - Retrieve a specific recipe by its ID and increment its view count.  

7. **Get User Recipes** (`GET /user-recipes/:userId`):  
   - Retrieve all recipes of a specific user.  

8. **Recipe Views Increment** (`GET /recipes/view/:recipeId`):  
   - Increment the view count for the specified recipe.  

9. **Get User Recipe Views** (`GET /user/:userId/views`):  
   - Retrieve the total views for all recipes created by the user.  

10. **Get User’s Most Viewed Recipe** (`GET /user/:userId/highestviews`):  
    - Retrieve the recipe with the highest views among all of the user’s recipes.  

11. **App Analytics** (`GET /analytics`):  
    - Retrieve:  
      - Total users  
      - Total recipes  
      - Average recipes per user  
      - Recipe with the highest views  
      - Recipe with the lowest views  

---  

## **Middleware**  

1. **Logger Middleware**:  
   - Log every request to the console with timestamp, method, and route.  

2. **Deletion Watch Middleware**:  
   - When a recipe is deleted, store the deleted recipe in a collection called `ArchivedRecipes`.  

---  

## **Instructions**  

1. **Schema Creation**:  
   - Ensure all fields are validated and relationships are properly established.  

2. **CRUD Operations**:  
   - Implement full CRUD for `User` and `Recipe` schemas.  

3. **View Management**:  
   - Increment view count on recipe retrieval and display total and highest views for each user.  

4. **Analytics**:  
   - Calculate app-wide statistics like total users, recipes, and average recipes per user.  

5. **Middleware Implementation**:  
   - Log every request and archive deleted recipes.  

---  

## **Sample Data**  

1. **User**:  
   ```json  
   {  
     "name": "Jane Doe",  
     "email": "jane@example.com"  
   }  
   ```  

2. **Recipe**:  
   ```json  
   {  
     "title": "Pasta Carbonara",  
     "description": "Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",  
     "ingredients": ["Spaghetti", "Eggs", "Cheese", "Pancetta", "Pepper"],  
     "instructions": "Cook spaghetti. Mix eggs and cheese. Fry pancetta. Combine all.",  
   }  
   ```  

---  

## **Good Practices**  

- **Data Integrity**: Validate all user and recipe inputs thoroughly.  
- **Error Handling**: Provide meaningful error messages with appropriate status codes.  
- **Logging**: Use the logger middleware to track all incoming requests.  
- **Archiving**: Safely store deleted recipes for future reference or recovery.  

---  

## **Submission**  
- Push the code to your Masai GitHub repo and share the link.  
