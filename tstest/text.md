- npm init -y
  
- npm install typescript ts-node
  
- tsc --init

```
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true
  }
}
```

- npx ts-node src/index.ts

or 

- tsc
- node dist/index.js


- .gitignore
   node_modules/
   dist/
