Absolutely! Here's a curated set of **aggregation queries** using **only `$group`, `$match`, and `$project`** — no `$lookup` or `$unwind`. These are super useful when you're working within a single collection (like `students`) and want to **filter, transform, or summarize data**.

---

## ✅ Collection Used: `students`

### 1. **Get average age of students**
```js
db.students.aggregate([
  {
    $group: {
      _id: null,
      averageAge: { $avg: "$age" }
    }
  },
  {
    $project: {
      _id: 0,
      averageAge: 1
    }
  }
])
```

---

### 2. **Group students by city and count how many students in each**
```js
db.students.aggregate([
  {
    $group: {
      _id: "$address.city",
      studentCount: { $sum: 1 }
    }
  },
  {
    $project: {
      city: "$_id",
      studentCount: 1,
      _id: 0
    }
  }
])
```

---

### 3. **Filter (match) students who enrolled after Feb 1, 2024 and group by city**
```js
db.students.aggregate([
  {
    $match: {
      enrolledOn: { $gte: ISODate("2024-02-01") }
    }
  },
  {
    $group: {
      _id: "$address.city",
      recentEnrollments: { $sum: 1 }
    }
  },
  {
    $project: {
      city: "$_id",
      recentEnrollments: 1,
      _id: 0
    }
  }
])
```

---

### 4. **Group students by age and get list of names in each group**
```js
db.students.aggregate([
  {
    $group: {
      _id: "$age",
      students: { $push: "$name" }
    }
  },
  {
    $project: {
      age: "$_id",
      students: 1,
      _id: 0
    }
  }
])
```

---

### 5. **Get count of students who are 21 or older**
```js
db.students.aggregate([
  {
    $match: {
      age: { $gte: 21 }
    }
  },
  {
    $group: {
      _id: null,
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      count: 1
    }
  }
])
```

---

### 6. **Get name and email of students aged between 20–22 only (filter + reshape)**
```js
db.students.aggregate([
  {
    $match: {
      age: { $gte: 20, $lte: 22 }
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      age: 1
    }
  }
])
```

---

Let me know if you'd like advanced grouping like:
- Top cities by enrollment
- Filtering by `scores` fields
- Combining `$group` with `$sort` and `$limit` for leaderboard-type queries

Want me to convert these to Mongoose syntax too?
To **group students by country** and **get details of each student**, you can use `$group` with `$push` or `$addToSet` to collect full student objects grouped by country.

Here's the aggregation:

---

### 📦 **Group students by country and get full student details**

```js
db.students.aggregate([
  {
    $group: {
      _id: "$address.country",
      students: { $push: "$$ROOT" }
    }
  },
  {
    $project: {
      _id: 0,
      country: "$_id",
      students: 1
    }
  }
])
```

---

### 🔍 Explanation:
- `$$ROOT`: Refers to the **entire document** of each student.
- `$group`: Groups all students by their `address.country`.
- `$push`: Collects each full student document into an array under the key `students`.
- `$project`: Renames `_id` to `country` and hides the Mongo `_id`.

---

### ✅ Sample Output (Simplified):
```js
{
  country: "USA",
  students: [
    {
      name: "Alice",
      email: "alice@example.com",
      age: 21,
      // ...
    },
    {
      name: "Bob",
      email: "bob@example.com",
      age: 22,
      // ...
    }
  ]
}
```

Want me to add filters like:
- Group by both `country` and `city`?
- Only students above a certain age in each country?

Let me know!
