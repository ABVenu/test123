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
