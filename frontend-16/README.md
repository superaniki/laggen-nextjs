

# Frontend part Laggen - the traditional wooden bucket editor

With this tool, you can easily create your library of buckets and print out templates for use as
you manually create your wooden bucket using manual tools like in the pre-industry society.

The project is pre-set to use PostgreSql, but to easily get it up and running, uncomment and uncomment the "datasource" related code in prisma/schema.prisma, so you use a local database with "sqlite" instead.

<b> Code with Next.js(app router), react, tailwind, SQLite or PostgreSQL</b>


To start:
> npm run dev


![Screenshot from 2024-04-08 12-06-49](https://github.com/superaniki/laggen-nextjs/assets/2293029/a973401f-4bdb-4f94-b1e5-a2808adfebee)
![Screenshot from 2024-04-08 12-08-24](https://github.com/superaniki/laggen-nextjs/assets/2293029/5e090a38-6693-458a-bb0f-e1b104d3bb79)


# Start using DOCKER

Build the image :
> sudo docker build -t laggen .

Start the image :
> sudo docker run --rm -it -p 3000:3000 laggen


For exporting image templates, you need to start both frontend and backend containers.

