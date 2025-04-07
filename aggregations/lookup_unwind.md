Perfect! Here's a collection of **Mongoose/MongoDB aggregation queries** using the updated `students` and `courses` collections.

---

### 🔍 1. **Get all courses each student is enrolled in**
Shows student name with course titles by joining via `$lookup` and `$unwind`.

```js
db.students.aggregate([
  { $unwind: "$courseIds" },
  {
    $lookup: {
      from: "courses",
      localField: "courseIds",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  { $unwind: "$courseDetails" },
  {
    $project: {
      _id: 0,
      student: "$name",
      email: 1,
      course: "$courseDetails.title",
      level: "$courseDetails.level",
      city: "$address.city"
    }
  }
])
```

---

### 📊 2. **Count how many students are enrolled in each course**
This uses `$unwind` + `$group` + `$lookup` for reverse mapping.

```js
db.students.aggregate([
  { $unwind: "$courseIds" },
  {
    $group: {
      _id: "$courseIds",
      studentCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "course"
    }
  },
  { $unwind: "$course" },
  {
    $project: {
      _id: 0,
      courseTitle: "$course.title",
      studentCount: 1
    }
  }
])
```

---

### 🧮 3. **Find average final score per course**
Assumes `scores` object stores final scores per courseId as keys.

```js
db.students.aggregate([
  {
    $project: {
      scoresArray: {
        $objectToArray: "$scores"
      }
    }
  },
  { $unwind: "$scoresArray" },
  {
    $group: {
      _id: { courseId: { $toObjectId: "$scoresArray.k" } },
      avgFinal: { $avg: "$scoresArray.v.final" }
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "_id.courseId",
      foreignField: "_id",
      as: "course"
    }
  },
  { $unwind: "$course" },
  {
    $project: {
      _id: 0,
      courseTitle: "$course.title",
      avgFinal: 1
    }
  }
])
```

---

### 🏙️ 4. **List all students from each city with their courses**
Shows how you can group by city after lookup.

```js
db.students.aggregate([
  { $unwind: "$courseIds" },
  {
    $lookup: {
      from: "courses",
      localField: "courseIds",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  { $unwind: "$courseDetails" },
  {
    $group: {
      _id: "$address.city",
      students: {
        $push: {
          name: "$name",
          course: "$courseDetails.title"
        }
      }
    }
  }
])
```

---

### 📚 5. **List all topics a student is learning**
This goes two-level deep: `student ➝ course ➝ topics`

```js
db.students.aggregate([
  { $unwind: "$courseIds" },
  {
    $lookup: {
      from: "courses",
      localField: "courseIds",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  { $unwind: "$courseDetails" },
  { $unwind: "$courseDetails.topics" },
  {
    $project: {
      _id: 0,
      student: "$name",
      topic: "$courseDetails.topics"
    }
  },
  {
    $group: {
      _id: "$student",
      topics: { $addToSet: "$topic" }
    }
  }
])
```

---

### 🧾 6. **List each student with scores per course and course title**
Unwind scores, join with course, and return all neatly.

```js
db.students.aggregate([
  {
    $project: {
      name: 1,
      scoresArray: { $objectToArray: "$scores" }
    }
  },
  { $unwind: "$scoresArray" },
  {
    $addFields: {
      courseIdObj: { $toObjectId: "$scoresArray.k" },
      score: "$scoresArray.v"
    }
  },
  {
    $lookup: {
      from: "courses",
      localField: "courseIdObj",
      foreignField: "_id",
      as: "course"
    }
  },
  { $unwind: "$course" },
  {
    $project: {
      _id: 0,
      student: "$name",
      courseTitle: "$course.title",
      midterm: "$score.midterm",
      final: "$score.final"
    }
  }
])
```

---

Let me know if you want to filter by score ranges, sort by top students, or visualize course popularity next. Want me to wrap this up in a Mongoose script too?
