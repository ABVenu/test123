- npm init -y
  
- npm install typescript ts-node
  
- tsc --init

```
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "CommonJS",
    "target": "ES6",
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
