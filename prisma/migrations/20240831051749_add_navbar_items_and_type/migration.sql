-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NavbarItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "route" TEXT,
    "order" INTEGER NOT NULL,
    "parentId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL DEFAULT 'PAGE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavbarItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavbarItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NavbarItem" ("createdAt", "id", "isActive", "order", "parentId", "route", "title", "updatedAt") SELECT "createdAt", "id", "isActive", "order", "parentId", "route", "title", "updatedAt" FROM "NavbarItem";
DROP TABLE "NavbarItem";
ALTER TABLE "new_NavbarItem" RENAME TO "NavbarItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
