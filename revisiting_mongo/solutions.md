Here are the MongoDB queries to answer all the questions, including the additional ones:

```javascript
// 1. Retrieve all users aged between 22 and 30, only showing names and ages
db.users.find({ age: { $gte: 22, $lte: 30 } }, { name: 1, age: 1, _id: 0 });

// 2. Find users who enrolled in "React Basics" course
db.users.find({ "enrolledCourses.title": "React Basics" });

// 3. Sort users by their joining date (newest first)
db.users.find().sort({ joinedAt: -1 });

// 4. Count users who have at least one course progress > 50%
db.users.countDocuments({ "enrolledCourses.progress": { $gt: 50 } });

// 5. Get users who joined in the last 6 months
db.users.find({ joinedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } });

// 6. Retrieve only emails of all users
db.users.find({}, { email: 1, _id: 0 });

// 7. Find users with an email ending in "@example.com"
db.users.find({ email: { $regex: "@example\\.com$" } });

// 8. Get the average age of all users
db.users.aggregate([{ $group: { _id: null, avgAge: { $avg: "$age" } } }]);

// 9. Get the highest-rated course
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $sort: { "enrolledCourses.rating": -1 } },
  { $limit: 1 },
  { $project: { _id: 0, "enrolledCourses.title": 1, "enrolledCourses.rating": 1 } }
]);

// 10. Find users who have not enrolled in any courses
db.users.find({ enrolledCourses: { $exists: true, $size: 0 } });

// 11. Get users sorted by the number of courses they enrolled in (Descending)
db.users.aggregate([
  { $project: { name: 1, numCourses: { $size: "$enrolledCourses" } } },
  { $sort: { numCourses: -1 } }
]);

// 12. Users who have at least 2 courses enrolled
db.users.find({ enrolledCourses: { $size: 2 } });

// 13. Find users who rated any course lower than 4.5
db.users.find({ "enrolledCourses.rating": { $lt: 4.5 } });

// 14. Count how many users are above 25 years old
db.users.countDocuments({ age: { $gt: 25 } });

// 15. Get the total number of unique courses enrolled by users
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $group: { _id: "$enrolledCourses.courseId" } },
  { $count: "totalUniqueCourses" }
]);

// 16. Get users who enrolled in "MongoDB Deep Dive" with progress above 50%
db.users.find({ "enrolledCourses": { $elemMatch: { title: "MongoDB Deep Dive", progress: { $gt: 50 } } } });

// ---- Additional Queries ----

// 17. Find users who have enrolled in either "React Basics" or "Node.js Fundamentals"
db.users.find({ "enrolledCourses.title": { $in: ["React Basics", "Node.js Fundamentals"] } });

// 18. Retrieve users who have enrolled in a course with progress greater than 70%
db.users.find({ "enrolledCourses.progress": { $gt: 70 } });

// 19. Get users who have not enrolled in "Python for Data Science"
db.users.find({ "enrolledCourses.title": { $ne: "Python for Data Science" } });

// 20. Find users who joined before July 1, 2023
db.users.find({ joinedAt: { $lt: ISODate("2023-07-01T00:00:00Z") } });

// 21. Retrieve users who have exactly 2 courses enrolled
db.users.find({ "enrolledCourses": { $size: 2 } });

// 22. Find users who have given a rating of less than 4.5 in any course
db.users.find({ "enrolledCourses.rating": { $lt: 4.5 } });

// 23. Get a list of all unique courses enrolled by users
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $group: { _id: "$enrolledCourses.title" } }
]);

// 24. Count how many users are enrolled in at least 3 courses
db.users.countDocuments({ "enrolledCourses.2": { $exists: true } });

// 25. Find users who have completed at least one course (progress = 100%)
db.users.find({ "enrolledCourses.progress": 100 });

// 26. Get a list of all courses with their average rating
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $group: { _id: "$enrolledCourses.title", avgRating: { $avg: "$enrolledCourses.rating" } } }
]);

// 27. Find the oldest user who has enrolled in at least one course
db.users.find({ enrolledCourses: { $exists: true, $ne: [] } }).sort({ age: -1 }).limit(1);

// 28. Retrieve users who have rated any course exactly 5 stars
db.users.find({ "enrolledCourses.rating": 5 });

// 29. Get users sorted by the total progress across all their enrolled courses
db.users.aggregate([
  { $unwind: "$enrolledCourses" },
  { $group: { _id: "$_id", name: { $first: "$name" }, totalProgress: { $sum: "$enrolledCourses.progress" } } },
  { $sort: { totalProgress: -1 } }
]);

// 30. Find users who have enrolled in both "React Basics" and "Node.js Fundamentals"
db.users.find({
  "enrolledCourses.title": { $all: ["React Basics", "Node.js Fundamentals"] }
});

// 31. Count how many users have enrolled in at least one course with progress below 50%
db.users.countDocuments({ "enrolledCourses.progress": { $lt: 50 } });
```

These queries use a mix of inbuilt MongoDB operators such as:
- `$gte`, `$lte`, `$gt`, `$lt` (for range queries)
- `$in`, `$ne`, `$all` (for matching multiple values)
- `$exists`, `$size`, `$elemMatch` (for handling arrays)
- `$unwind`, `$group`, `$avg`, `$sum`, `$project` (for aggregations)

Let me know if you need any modifications or explanations! 🚀
