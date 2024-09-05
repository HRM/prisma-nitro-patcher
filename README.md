# Prisma Nitro Patcher 🩹

 As reported by some users in the past, there are and were some ongoing issues with the typing performance of the prisma client when a large schema is combined with client extensions ([1](https://github.com/prisma/prisma/issues/4807#issuecomment-2239542737),[2](https://github.com/prisma/prisma/issues/23761),[3](https://github.com/prisma/prisma/issues/17843)). This tool is developed to provide an alternative route for those who need a quick solution, **till the prisma team introduces some fix**. It mostly builds on the type system provided by the prisma team with some small alterations, it only changes the generated index.d.ts, there is no change in runtime behavior. **Use it for improved editor and compilation performance.**

 As this package provides only a patch witch is a bad practice on the long run, and probably it wont be required anyway, it wont reach  major version 1

 ### Setup instructions
 
 1. `npm i prisma-nitro-patcher` `yarn add prisma-nitro-patcher`
 2. add the patcher to the generators in the **schema** file, important to add it **after the client generator**.
    ```prisma
    generator client {
        provider        = "prisma-client-js"
        previewFeatures = []
    }

    generator patcher {
        provider        = "prisma-nitro-patcher"
    }
    ```
3. run `prisma generate`, this will automatically generate and patch the prisma client

Alternatively you can also use this tool trough cli: `npx prisma-nitro-patcher`

---
The patch was tested with prisma version 5.19.1 and typescript version 5.5.4. If you have any findings, problems feel free to open an issue.
 