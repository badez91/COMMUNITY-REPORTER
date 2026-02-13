# Run this migration manually

## Option 1: Using Prisma CLI (Recommended)
```bash
npx prisma migrate dev --name add_photo_and_location
```

## Option 2: Run SQL directly in Supabase
1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Run this SQL:

```sql
ALTER TABLE "Report" 
ADD COLUMN IF NOT EXISTS "photoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "address" TEXT;
```

## Option 3: Deploy migration on Vercel
The migration will run automatically when you deploy to Vercel with:
```bash
npm run build
```

## After migration, regenerate Prisma client:
```bash
npx prisma generate
```
