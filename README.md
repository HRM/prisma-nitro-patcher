# Prisma Nitro Patcher 🩹

Some users have reported ongoing issues with the typing performance of the Prisma client, particularly when a large schema is combined with client extensions (see [1](https://github.com/prisma/prisma/issues/4807#issuecomment-2239542737), [2](https://github.com/prisma/prisma/issues/23761), and [3](https://github.com/prisma/prisma/issues/17843)). This tool offers an alternative solution for those who need a quick fix until the Prisma team releases an official patch. It builds primarily on the type system provided by the Prisma team but introduces some modifications. It only alters the generated `index.d.ts`, ensuring there is no change in runtime behavior. **If you're experiencing issues with extensions, use this tool to improve your editor and compilation performance.**
 ### Benefits and drawbacks

Depending on your use case, this patch can improve typing performance, potentially reducing performance loss by 20% to 70%. However, please note that the patch achieves this by simplifying the type system. As a result, you may experience a reduction in type checks. For most users, this should not pose a significant issue.

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

Alternatively you can also use this tool trough cli: `npx prisma-nitro-patcher-cli`

---
The patch was tested with prisma version 5.19.1, 5.20.0 and typescript version 5.5.4. If you have any findings, problems feel free to open an issue.
 