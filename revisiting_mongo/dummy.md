### **Session: Revisiting Mongo Queries**  
**Duration:** 1.5 Hours  
**Focus Areas:** Deep dive into MongoDB queries covering filtering, projections, sorting, indexing, advanced querying, and a small part of aggregation.

---

## **Problem Statement**  
A startup **"SkillNest"** manages a database of users enrolled in various online courses. Each user has a profile with details such as name, age, email, enrollment date, enrolled courses, progress, and ratings. The goal of this session is to practice MongoDB queries to extract meaningful insights.

---

## **Sample Data (Insert into `users` Collection)**  
```json
db.users.insertMany([
  {
    "_id": 1, "name": "Alice", "age": 24, "email": "alice@example.com",
    "enrolledCourses": [
      { "courseId": 101, "title": "React Basics", "progress": 80, "rating": 4.5 }
    ],
    "joinedAt": ISODate("2023-06-12T10:30:00Z")
  },
  {
    "_id": 2, "name": "Bob", "age": 28, "email": "bob@example.com",
    "enrolledCourses": [
      { "courseId": 102, "title": "Node.js Fundamentals", "progress": 40, "rating": 4.2 },
      { "courseId": 103, "title": "MongoDB Deep Dive", "progress": 20, "rating": 4.8 }
    ],
    "joinedAt": ISODate("2023-07-10T15:45:00Z")
  },
  {
    "_id": 3, "name": "Charlie", "age": 22, "email": "charlie@example.com",
    "enrolledCourses": [
      { "courseId": 101, "title": "React Basics", "progress": 90, "rating": 4.7 },
      { "courseId": 104, "title": "GraphQL Mastery", "progress": 60, "rating": 4.5 }
    ],
    "joinedAt": ISODate("2023-08-05T12:00:00Z")
  },
  {
    "_id": 4, "name": "David", "age": 30, "email": "david@example.com",
    "enrolledCourses": [
      { "courseId": 102, "title": "Node.js Fundamentals", "progress": 75, "rating": 4.0 }
    ],
    "joinedAt": ISODate("2023-06-25T14:20:00Z")
  },
  {
    "_id": 5, "name": "Eve", "age": 27, "email": "eve@example.com",
    "enrolledCourses": [
      { "courseId": 105, "title": "Python for Data Science", "progress": 30, "rating": 4.9 }
    ],
    "joinedAt": ISODate("2023-05-15T08:00:00Z")
  },
  {
    "_id": 6, "name": "Frank", "age": 26, "email": "frank@example.com",
    "enrolledCourses": [
      { "courseId": 101, "title": "React Basics", "progress": 95, "rating": 4.6 }
    ],
    "joinedAt": ISODate("2023-09-01T16:10:00Z")
  },
  {
    "_id": 7, "name": "Grace", "age": 29, "email": "grace@example.com",
    "enrolledCourses": [
      { "courseId": 103, "title": "MongoDB Deep Dive", "progress": 50, "rating": 4.3 },
      { "courseId": 105, "title": "Python for Data Science", "progress": 80, "rating": 4.7 }
    ],
    "joinedAt": ISODate("2023-07-30T10:45:00Z")
  },
  {
    "_id": 8, "name": "Henry", "age": 25, "email": "henry@example.com",
    "enrolledCourses": [
      { "courseId": 106, "title": "Docker Essentials", "progress": 60, "rating": 4.2 }
    ],
    "joinedAt": ISODate("2023-09-10T18:30:00Z")
  }
])
```
*(Extend dataset with similar user entries to make it 15-20 records.)*

---

## **Mongo Queries for the Session (20 Queries)**  

### **1️⃣ Retrieve all users aged between 22 and 30, only showing names and ages**
```json
db.users.find({ "age": { $gte: 22, $lte: 30 } }, { "name": 1, "age": 1, "_id": 0 })
```

### **2️⃣ Find users who enrolled in "React Basics" course**
```json
db.users.find({ "enrolledCourses.title": "React Basics" }, { "name": 1, "email": 1 })
```

### **3️⃣ Sort users by their joining date (newest first)**
```json
db.users.find({}, { "name": 1, "joinedAt": 1 }).sort({ "joinedAt": -1 })
```

### **4️⃣ Count users who have at least one course progress > 50%**
```json
db.users.countDocuments({ "enrolledCourses.progress": { $gt: 50 } })
```

### **5️⃣ Get users who joined in the last 6 months**
```json
db.users.find({ "joinedAt": { $gte: ISODate("2023-06-01T00:00:00Z") } })
```

### **6️⃣ Retrieve only emails of all users**
```json
db.users.find({}, { "email": 1, "_id": 0 })
```

### **7️⃣ Find users with an email ending in "@example.com"**
```json
db.users.find({ "email": { $regex: "@example\\.com$" } })
```

### **8️⃣ Get the average age of all users (Aggregation)**
```json
db.users.aggregate([{ $group: { _id: null, avgAge: { $avg: "$age" } } }])
```

### **9️⃣ Get the highest-rated course**
```json
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $sort: { "enrolledCourses.rating": -1 } },
  { $limit: 1 }
])
```

### **🔟 Find users who have not enrolled in any courses**
```json
db.users.find({ "enrolledCourses": { $size: 0 } })
```

### **1️⃣1️⃣ Get users sorted by the number of courses they enrolled in (Descending)**
```json
db.users.aggregate([
  { $project: { name: 1, totalCourses: { $size: "$enrolledCourses" } } },
  { $sort: { totalCourses: -1 } }
])
```

### **1️⃣2️⃣ Users who have at least 2 courses enrolled**
```json
db.users.find({ "enrolledCourses.1": { $exists: true } })
```

### **1️⃣3️⃣ Find users who rated any course lower than 4.5**
```json
db.users.find({ "enrolledCourses.rating": { $lt: 4.5 } })
```

### **1️⃣4️⃣ Count how many users are above 25 years old**
```json
db.users.countDocuments({ "age": { $gt: 25 } })
```

### **1️⃣5️⃣ Get the total number of unique courses enrolled by users**
```json
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $group: { _id: "$enrolledCourses.courseId" } },
  { $count: "totalCourses" }
])
```

### **1️⃣6️⃣ Create an index on email for faster searches**
```json
db.users.createIndex({ "email": 1 })
```

### **1️⃣7️⃣ Get users who enrolled in "MongoDB Deep Dive" with progress above 50%**
```json
db.users.find({ "enrolledCourses.title": "MongoDB Deep Dive", "enrolledCourses.progress": { $gt: 50 } })
```

---

Would you like me to add more complex queries or modify any part of the session? 🚀
