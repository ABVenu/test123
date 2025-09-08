# Step 1: Project setup & Git init
git init
git add pom.xml
git commit -m "chore: initialize maven project with dependencies"

# Add the test class with GET test
git add src/test/java/com/example/ReqResApiTests.java
git commit -m "feat: add test for listing users"

# Add POST test (initial non-parameterized if you want intermediate commit) — optional
# git commit -m "feat: add test for creating a user"

# Refactor POST to parameterized
git commit -am "refactor: parameterize user creation test"

# Add PUT test
git commit -am "feat: add test for updating a user"

# Add DELETE test
git commit -am "feat: add test for deleting a user"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/<your-username>/reqres-tests.git
git push -u origin main
